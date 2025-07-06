import modal

app = modal.App(name="WhatsThisSound")
image = (modal.Image.debian_slim().pip_install_from_requirements("requirements.txt").apt_install(["wget", "unzip", "ffmpeg", "libsndfile1"]).run_commands(["cd /tmp && wget https://github.com/karolpiczak/ESC-50/archive/master.zip -O esc50.zip", "cd /tmp && unzip esc50.zip","mkdir -p /opt/esc50-data", "cp -r /tmp/ESC-50-master/* /opt/esc50-data/", "rm -rf /tmp/ESC-50-master /tmp/esc50.zip"]).add_local_python_source("model"))

volume = modal.Volume.from_name("esc-50-data", create_if_missing=True)
model_volume = modal.Volume.from_name("esc-model", create_if_missing=True)

@app.function(image=image, volumes={"/data": volume, "/models": model_volume}, gpu="A10G", timeout=3600 * 3)
def train():
    print("Training...")


@app.local_entrypoint()
def main():
    train.remote()
