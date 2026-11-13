# 喜仔桌宠 for DeepSeek Harness

喜仔是一个 [dsh-pet](https://github.com/PC2005-cloud/dsh-pet) 角色包：坐着做双手 V 字手势，平时会等待和挥手。点击喜仔时，它会挥手并显示“我四风了”。这句话是动画气泡，不会发送到聊天框。

![喜仔点击效果](preview.png)

## 安装

本角色包需要先安装并启用 **dsh-pet 0.4.7 或兼容版本**。在 DeepSeek Harness 的插件管理中先安装 `dsh-pet`，再添加 `github:csl1002/dsh-xizai-pet`。使用命令行：

```sh
dsh plugin --profile desktop add dsh-pet
dsh plugin --profile desktop add github:csl1002/dsh-xizai-pet
```

完全退出并重启 DeepSeek Harness。喜仔默认出现在桌面右下角。如果首次启动后未出现，请再重启一次，并在 dsh-pet 的桌宠配置中检查喜仔是否启用。浏览器版请把上面的 `desktop` 换成 `web`，并在桌宠配置中将喜仔的显示位置设为 web 或 both。

动画采用带透明通道的 VP9 WebM；Safari 和 WebKit 环境需要另行提供兼容格式的素材。

## 配置与卸载

插件首次启动时，把素材和默认配置复制到 `$DSH_HOME/dsh-pet/pet/`（默认 `~/.dsh/dsh-pet/pet/`），不会覆盖已有文件。你可以在 dsh-pet 设置中调整喜仔的位置、大小及显示方式。

卸载本插件后，角色包文件会保留。若还想移除喜仔，请手动删除该目录下的 `xizai-pet-config.json` 和 `xizai-pet-animation` 目录，然后重启 DSH。

## 开发

需要 Node.js 22.12 或更高版本。运行 `node --test tests/*.test.js` 检查安装和配置保留行为。

## 许可

MIT，见 [LICENSE](LICENSE)。本项目使用 dsh-pet 提供宠物显示能力。
