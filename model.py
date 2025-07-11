import torch.nn as nn
import torch
class ResidualBlock(nn.Module):
    def __init__(self, input_channels, output_channels, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(input_channels, output_channels, 3, stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(output_channels)
        self.conv2 = nn.Conv2d(output_channels, output_channels, 3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(output_channels)
        self.shortcut = nn.Sequential()
        self.use_shortcut = stride != 1 or input_channels != output_channels
        if self.use_shortcut:
            self.shortcut = nn.Sequential(
                nn.Conv2d(input_channels, output_channels, 1, stride, bias=False),
                nn.BatchNorm2d(output_channels)
            )
    def forward(self, x, feature_maps=None, prefix=""):
        out = self.conv1(x)
        out = self.bn1(out)
        out = torch.relu(out)
        out = self.conv2(out)
        out = self.bn2(out)
        shortcut = self.shortcut(x) if self.use_shortcut else x
        out_add = out + shortcut
        if feature_maps is not None:
            feature_maps[f"{prefix}.conv1"] = out_add

        out = torch.relu(out_add)

        if feature_maps is not None:
            feature_maps[f"{prefix}.relu"] = out

        return out

class AudioCNN(nn.Module):
    def __init__(self, num_classes=50):
        super().__init__()
        self.conv1 = nn.Sequential(
            nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2, padding=1)
        )
        self.layer1 = nn.ModuleList([ResidualBlock(64, 64) for _ in range(3)])
        self.layer2 = nn.ModuleList([ResidualBlock(64 if i == 0 else 128, 128, stride=2 if i==0 else 1) for i in range(4)])
        self.layer3 = nn.ModuleList([ResidualBlock(128 if i == 0 else 256 , 256, stride=2 if i==0 else 1) for i in range(6)])
        self.layer4 = nn.ModuleList([ResidualBlock(256 if i == 0 else 512, 512, stride=2 if i==0 else 1) for i in range(3)])
        self.average_pool = nn.AdaptiveAvgPool2d((1, 1))
        self.dropout = nn.Dropout(0.5)
        self.fc = nn.Linear(512, num_classes)

    def forward(self, x, return_feature_maps=False):
        if not return_feature_maps:
            x = self.conv1(x)
            for block in self.layer1:
                x = block(x)
            for block in self.layer2:
                x = block(x)
            for block in self.layer3:
                x = block(x)
            for block in self.layer4:
                x = block(x)
            x = self.average_pool(x)
            x = x.view(x.size(0), -1)
            x = self.dropout(x)
            x = self.fc(x)
            return x
        else:
            feature_maps = {}
            x = self.conv1(x)
            feature_maps["conv1"] = x

            for idx, block in enumerate(self.layer1):
                x = block(x, feature_maps, prefix=f"layer1.block{idx}")
            feature_maps["layer1"] = x

            for idx, block in enumerate(self.layer2):
                x = block(x, feature_maps, prefix=f"layer2.block{idx}")
            feature_maps["layer2"] = x

            for idx, block in enumerate(self.layer3):
                x = block(x, feature_maps, prefix=f"layer3.block{idx}")
            feature_maps["layer3"] = x

            for idx, block in enumerate(self.layer4):
                x = block(x, feature_maps, prefix=f"layer4.block{idx}")
            feature_maps["layer4"] = x

            x = self.average_pool(x)
            x = x.view(x.size(0), -1)
            x = self.dropout(x)
            x = self.fc(x)
            return x, feature_maps