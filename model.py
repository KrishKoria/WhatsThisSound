import torch.nn as nn
import torch
class ResidualBlock(nn.Module):
    def __init__(self, input_channels, output_channels, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(input_channels, output_channels, 3, stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(output_channels)
        self.conv2 = nn.Conv2d(output_channels, output_channels, 3, stride, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(output_channels)
        self.shortcut = nn.Sequential()
        self.use_shortcut = stride != 1 or input_channels != output_channels
        if self.use_shortcut:
            self.shortcut = nn.Sequential(
                nn.Conv2d(input_channels, output_channels, 1, stride, bias=False),
                nn.BatchNorm2d(output_channels)
            )
    def forward(self, x):
        out = self.conv1(x)
        out = self.bn1(out)
        out = torch.relu(out)
        out = self.conv2(x)
        out = self.bn2(out)
        shortcut = self.shortcut(x) if self.use_shortcut else x
        out_add = out + shortcut
        out = torch.relu(out_add)
        return out
    