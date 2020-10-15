const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  configureWebpack: {
    plugins: [],
  },
  pluginOptions: {
    electronBuilder: {
      // Prevent bundling of certain imported packages and instead retrieve these external dependencies at runtime.
      // In order to connect to websocket.
      externals: ["mqtt"],
      builderOptions: {
        productName: "forwarding_tool",
        appId: "com.flight.transmit",
        win: {
          icon: "./public/app.ico",
          target: [
            {
              target: "nsis",
              arch: ["x64", "ia32"],
            },
          ],
          publish: ["github"],
        },
        mac: {
          icon: "./public/icon.icns",
          target: ["pkg", "dmg", "zip"],
        },
        linux: {
          icon: "./public/app.png",
        },
      },
    },
  },
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("src", resolve("src"))
      .set("common", resolve("src/common"))
      .set("components", resolve("src/components"));
  },
};
