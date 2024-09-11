/*
This file is part of tencent-letsgo-tools.
Copyright (C) 2024  xkk1

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
// 网站整体框架
"use strict";
// 导航菜单
const menu = {
    "./index.html": "主页",
    "通用": {
        "./common/newline-text.html": "换行文本生成器",
    },
    "星宝农场工具": {
        "./farm/suggested-watering-time.html": "作物浇水建议",
        // "./farm/experience.html": "农场经验表"
    },
    "./about.html": "关于"
}

// 网站整体框架模板 HTMLElement
class SiteLayout extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // 获取相对路径
        let currentPagePath = "";
        if (this.hasAttribute("current-page-path")) {
            currentPagePath = this.getAttribute("current-page-path");
        }
        let currentPagePathAttribute = "";
        if (currentPagePath !== "") {
            currentPagePathAttribute = ` current-page-path="${currentPagePath}"`;
        }
        // 获取标题
        let title = "";
        if (this.hasAttribute("data-title")) {
            title = this.getAttribute("data-title");
        } else {
            for (let item in menu) {
                if (title !== "") {
                    break;
                }
                if (typeof menu[item] === "string") {
                    if (item == currentPagePath) {
                        title = menu[item];
                        break;
                    }
                } else {
                    for (let subItem in menu[item]) {
                        if (subItem == currentPagePath) {
                            title = menu[item][subItem];
                            break;
                        }
                    }
                }
            }
        }
        let titleHTML = "";
        if (title !== "") {
            titleHTML = `<mdui-top-app-bar-title>${title}</mdui-top-app-bar-title>`;
        }
        // 创建影子根
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
<mdui-layout style="height: 100%;">
    <mdui-layout-item placement="top" class="example-layout-item" style="padding: 0.5rem; background-color: rgb(var(--mdui-color-error-container)); color: rgb(var(--mdui-color-on-error-container));">
        <p style="text-align: center; margin: 0; width: 100%;">
            内部测试中，反馈 QQ 群：
            <a style="color: rgb(var(--mdui-color-on-error-container)); text-decoration: underline;" href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=4r-RYejLgfsEApX2DHXeWK9ZMr4Pl8r-&authKey=tBYRc5MCMsmJXKJ7UaOqhidLDQHr3Gb%2BcW%2FaujaeCZYlEc2KzFT%2F7p%2BcEpmT8lrb&noverify=0&group_code=595103909" target="_blank">595103909</a>
        </p>
    </mdui-layout-item>
    <mdui-top-app-bar id="top-app-bar" scroll-behavior="elevate">
        <!-- 侧边目录打开关闭按钮 -->
        <mdui-button-icon id="menu-button">
            <mdui-icon-menu></mdui-icon-menu>
        </mdui-button-icon>
        ${titleHTML}
        <div style="flex-grow: 1"></div>
        <!-- 复制分享本页 -->
        <mdui-button-icon id="share-button" title="复制分享本页">
            <mdui-icon-share--outlined class="outlined"></mdui-icon-share--outlined>
            <mdui-icon-share class="filled"></mdui-icon-share>
        </mdui-button-icon>
        <!-- 切换深浅主题 -->
        <mdui-dropdown>
            <mdui-button-icon id="theme-button" slot="trigger" title="切换深浅主题">
                <mdui-icon-auto-mode class="outlined"></mdui-icon-auto-mode>
                <mdui-icon-auto-mode class="filled"></mdui-icon-auto-mode>
            </mdui-button-icon>
            <mdui-menu id="theme-select" selects="single">
                <mdui-menu-item value="light">浅色主题<mdui-icon-light-mode--outlined slot="icon"></mdui-icon-light-mode--outlined><mdui-icon-light-mode slot="selected-icon"></mdui-icon-light-mode></mdui-menu-item>
                <mdui-menu-item value="dark">深色主题<mdui-icon-dark-mode--outlined slot="icon"></mdui-icon-dark-mode--outlined><mdui-icon-dark-mode slot="selected-icon"></mdui-icon-dark-mode></mdui-menu-item>
                <mdui-divider></mdui-divider>
                <mdui-menu-item  value="auto">跟随系统<mdui-icon-auto-mode slot="icon"></mdui-icon-auto-mode></mdui-menu-item>
            </mdui-menu>
        </mdui-dropdown>
        <!-- 更改配色方案 -->
        <mdui-dropdown>
            <mdui-button-icon slot="trigger" title="更改配色方案">
                <mdui-icon-color-lens--outlined class="outlined"></mdui-icon-color-lens--outlined>
                <mdui-icon-color-lens class="filled"></mdui-icon-color-lens>
            </mdui-button-icon>
            <mdui-card style="width: 240px;padding: 1rem;">
                <p>预设配色方案</p>
                <div id="color-scheme-cards">
                    <color-scheme-card color="#FF0000"></color-scheme-card>
                    <color-scheme-card color="#FF7F00"></color-scheme-card>
                    <color-scheme-card color="#FFFF00"></color-scheme-card>
                    <color-scheme-card color="#00FF00"></color-scheme-card>
                    <color-scheme-card color="#00FFFF"></color-scheme-card>
                    <color-scheme-card color="#0000FF"></color-scheme-card>
                    <color-scheme-card color="#8B00FF"></color-scheme-card>
                    <color-scheme-card color="#FF69B4"></color-scheme-card>
                </div>
                <mdui-divider></mdui-divider>
                <label for="color-scheme-input">
                    <p>自选配色方案</p>
                </label>
                <input type="color" id="color-scheme-input" />
            </mdui-card>
        </mdui-dropdown>
    </mdui-top-app-bar>
  
    <mdui-navigation-drawer open class="navigation-drawer" close-on-overlay-click>
        <!-- 侧边目录 -->
        <navigation-menu${currentPagePathAttribute}></navigation-menu>
    </mdui-navigation-drawer>
  
    <mdui-layout-main class="layout-main" style="min-height: 300px">
        <slot></slot>
    </mdui-layout-main>
</mdui-layout>
<style>
    mdui-top-app-bar mdui-button-icon>.filled,
    mdui-top-app-bar mdui-button-icon:hover>.outlined {
        display: none;
    }

    mdui-top-app-bar mdui-button-icon:hover>.filled,
    mdui-top-app-bar mdui-button-icon>.outlined {
        display: initial;
    }

    #color-scheme-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.5rem;
    }

    #color-scheme-cards color-scheme-card {
        display: block;
        flex: 0 1 auto;
        width: 1.875rem;
        height: 1.875rem;
        border-radius: 0.5rem;
        cursor: pointer;
        border-radius: var(--mdui-shape-corner-extra-small);
        border: .0625rem solid rgb(var(--mdui-color-outline));
    }
</style>
        `.trim();
        // mdui-layout-main 滚动时标题改变背景色
        let topAppBarElement = this.shadowRoot.querySelector("mdui-top-app-bar");
        topAppBarElement.scrollTarget = this.shadowRoot.querySelector("mdui-layout-main");
        // 侧边目录按钮绑定事件
        let navigationDrawerElement = this.shadowRoot.querySelector('mdui-navigation-drawer');
        let menuButtonElement = this.shadowRoot.querySelector('#menu-button');
        menuButtonElement.addEventListener("click", function () {
            if (navigationDrawerElement.open === false) {
                navigationDrawerElement.open = true;
            } else {
                navigationDrawerElement.open = false;
            }
        });
        // 侧边目录按钮图标展开关闭
        navigationDrawerElement.addEventListener("opened", () => {
            menuButtonElement.innerHTML = `<mdui-icon-menu-open></mdui-icon-menu-open>`;
            menuButtonElement.setAttribute("title", "收起侧边目录");
        });
        navigationDrawerElement.addEventListener("closed", () => {
            menuButtonElement.innerHTML = `<mdui-icon-menu></mdui-icon-menu>`;
            menuButtonElement.setAttribute("title", "展开侧边目录");
        });
        // 监听窗口的尺寸变化来调整是否显示侧边抽屉栏函数
        function autoNavigationDrawer() {
            // 当前页面断点是否小于 md 
            if (mdui.breakpoint().down('md')) {
                // 小于 md ——手机，默认关闭侧边抽屉栏
                navigationDrawerElement.open = false;
            } else {
                // 大于等于 md ——电脑等大屏，默认显示侧边抽屉栏
                navigationDrawerElement.open = true;
                menuButtonElement.innerHTML = `<mdui-icon-menu-open></mdui-icon-menu-open>`;
            }
        }
        autoNavigationDrawer();
        window.addEventListener('resize', utilities.debounce(autoNavigationDrawer, 400));
        // 浅色主题 深色主题 跟随系统
        let themeSelectElement = this.shadowRoot.getElementById("theme-select");
        let themeButtonElement = this.shadowRoot.getElementById("theme-button");
        let theme = localStorage.getItem("theme") || "auto"; // 默认跟随系统
        themeSelectElement.value = theme;
        function changeTheme() {
            if (themeSelectElement.value) {
                theme = themeSelectElement.value;
                document.documentElement.classList.remove("mdui-theme-" + mdui.getTheme());
                document.documentElement.classList.add("mdui-theme-" + theme);
                themeButtonElement.innerHTML = `
    <mdui-icon-${theme}-mode--outlined class="outlined"></mdui-icon-${theme}-mode--outlined>
    <mdui-icon-${theme}-mode class="filled"></mdui-icon-${theme}-mode>
                `.trim();
                localStorage.setItem("theme", theme);
            } else {
                setTimeout(() => {
                    themeSelectElement.value = theme;
                } ,0);
            }
            
        }
        changeTheme();
        themeSelectElement.addEventListener("change", changeTheme);
        // 配色方案
        let colorSchemeInputElement = this.shadowRoot.getElementById("color-scheme-input");
        colorSchemeInputElement.value = localStorage.getItem("colorScheme") || "#00ff00"; // 默认绿色
        function changeColorScheme(colorScheme) {
            if (typeof colorScheme === "string") {
                colorSchemeInputElement.value = colorScheme;
            } else {
                colorScheme = colorSchemeInputElement.value;
            }
            mdui.setColorScheme(colorScheme);
            localStorage.setItem("colorScheme", colorScheme);
        }
        changeColorScheme();
        colorSchemeInputElement.addEventListener("change", changeColorScheme);
        this.shadowRoot.querySelectorAll("color-scheme-card[color]").forEach(element => {
            element.addEventListener("click", () => {
                changeColorScheme(element.getAttribute("color"));
            });
        });
        // 复制分享本页
        let shareButtonElement = this.shadowRoot.getElementById("share-button");
        shareButtonElement.addEventListener("click", () => {
            let shareText = document.title + " " + document.location.href;
            utilities.copyText(shareText);
            mdui.snackbar({
                message: "已复制链接到剪贴板，快去分享吧",
                placement: "top",
                autoCloseDelay: 3000,
                closeable: true
            });
        });
        // 加载 mdui 中文语言包
        mdui.loadLocale((locale) => import(`../libs/mdui/locales/zh-cn.js`));
        // 在需要切换语言时调用该函数。在 Promise resolve 后，语言切换成功
        mdui.setLocale('zh-cn');
    }
}
// 注册自定义元素 site-layout
customElements.define('site-layout', SiteLayout);


// 导航菜单
class NavigationMenu extends HTMLElement {
    constructor() {
        super();  
    }

    connectedCallback() {
        // 当前页面的相对路径
        let currentPagePath = "";
        // 当前页面相对路径的层级 "" | "../" | "../../"
        let beforePagePath = "";
        if (this.hasAttribute("current-page-path")) {
            currentPagePath = this.getAttribute("current-page-path");
            let currentPagePathSplit = currentPagePath.split("/");
            if (currentPagePathSplit.length > 1 && currentPagePathSplit[0] == ".") {
                currentPagePathSplit.shift();
            }
            for (let _ = 0; _ < currentPagePathSplit.length - 1; _++) {
                beforePagePath += "../";
            }
        }

        // 创建影子根
        this.attachShadow({ mode: "open" });
        // 生成导航目录 HTML
        let isAccordion = true; // 开始手风琴模式
        let menuHTML = `<mdui-list><mdui-collapse${isAccordion?" accordion":""}>`;
        let openCollapseValue = [];
        for (let item in menu) {
            if (typeof menu[item] === "string") {
                menuHTML += `<mdui-list-item rounded href="${beforePagePath + item}">${menu[item]}</mdui-list-item>`;
                // <mdui-list-item rounded active href="https://www.baidu.com">Headline</mdui-list-item>
            } else {
                menuHTML += `<mdui-collapse-item value="${item}">
<mdui-list-item rounded slot="header">${item}<mdui-icon-keyboard-arrow-down class="arrow" slot="end-icon"></mdui-icon-keyboard-arrow-down></mdui-list-item>
    <div class="sub-list">`;
                for (let subItem in menu[item]) {
                    menuHTML += `<mdui-list-item rounded href="${beforePagePath + subItem}">${menu[item][subItem]}</mdui-list-item>`;
                    if (subItem === currentPagePath) {
                        openCollapseValue.push(item);
                    }
                }
                menuHTML += `</div></mdui-collapse-item>`;
            }
        }
        menuHTML += `</mdui-collapse></mdui-list>`;
        menuHTML += `<style>
    mdui-list {
        margin: 0rem 0.5rem;
    }

    .sub-list {
        margin-left: 2rem
    }

    mdui-list-item[slot='header']>mdui-icon-keyboard-arrow-down {
        transform: rotate(0deg);
        transition: transform 0.2s ease-in-out;
    }
    mdui-list-item[slot='header']>mdui-icon-keyboard-arrow-down.arrow-active {
        /* 0.2s 旋转180度 */
        transform: rotate(180deg);
    }
</style>`.trim();
        // 显示导航目录
        this.shadowRoot.innerHTML = menuHTML;
        // 激活当前目录的列表项
        this.shadowRoot.querySelectorAll("mdui-list-item[href='" + beforePagePath + currentPagePath + "']").forEach(item => {
            item.setAttribute("active", true);
        });
        // 折叠面板展开关闭三角
        let menuCollapseElement = this.shadowRoot.querySelector("mdui-collapse");
        if (openCollapseValue.length > 0) {
            if (isAccordion) {
                menuCollapseElement.value = openCollapseValue[0];
            } else {
                menuCollapseElement.value = openCollapseValue;
            }
        }
        function onMenuCollapseChange() {
            let menuCollapseElementValue = menuCollapseElement.value;
            if (menuCollapseElementValue === undefined || (Array.isArray(menuCollapseElementValue) && menuCollapseElementValue.length === 0)) {
                // console.log("menuCollapseElementValue is 空");
                menuCollapseElement.querySelectorAll("mdui-collapse-item>mdui-list-item[slot='header']>.arrow").forEach(item => {
                    item.classList.remove("arrow-active");
                });
            } else if (typeof menuCollapseElementValue === "string") {
                // console.log("menuCollapseElementValue is 字符串");
                menuCollapseElement.querySelectorAll("mdui-collapse-item").forEach(item => {
                    if (item.getAttribute("value") !== menuCollapseElementValue) {
                        item.querySelector("mdui-list-item[slot='header']>.arrow").classList.remove("arrow-active");
                    } else {
                        item.querySelector("mdui-list-item[slot='header']>.arrow").classList.add("arrow-active");
                    }
                });
            } else if (Array.isArray(menuCollapseElementValue)) {
                // console.log("menuCollapseElementValue is Array");
                menuCollapseElement.querySelectorAll("mdui-collapse-item").forEach(item => {
                    if (menuCollapseElementValue.indexOf(item.getAttribute("value")) === -1) {
                        item.querySelector("mdui-list-item[slot='header']>.arrow").classList.remove("arrow-active");
                    } else {
                        item.querySelector("mdui-list-item[slot='header']>.arrow").classList.add("arrow-active");
                    }
                });
            }
        }
        menuCollapseElement.addEventListener("change", onMenuCollapseChange);
        onMenuCollapseChange();
    }
}
// 注册自定义元素 navigation-menu
customElements.define('navigation-menu', NavigationMenu);

// 配色方案预设卡片
class ColorSchemeCard extends HTMLElement {
    constructor() {
        super();  
    }

    connectedCallback() {
        // 获取颜色
        let color = "#00FF00";
        if (this.hasAttribute("color")) {
            color = this.getAttribute("color");
        }
        // 创建影子根
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
<mdui-tooltip>
    <div class="color-card"></div>
    <div slot="content">
        将配色方案设为：<span class="color-span">${color}</span>
    </div>
</mdui-tooltip>
<style>
    .color-card {
        width: 100%;
        height: 100%;
        background-color: ${color};
        border-radius: 0.25rem;
    }

    .color-span {
        color: ${color};
        font-weight: bold;
    }
</style>
        `.trim();
    }
}
// 注册自定义元素 color-scheme-card
customElements.define('color-scheme-card', ColorSchemeCard);