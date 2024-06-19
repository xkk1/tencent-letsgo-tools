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
// 常用工具卡片 HTMLElement
class ToolCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // 获取工具名称
        let name = "未知工具";
        if (this.hasAttribute("data-name")) {
            name = this.getAttribute("data-name");
        }
        // 获取工具链接
        let href = "#";
        if (this.hasAttribute("href")) {
            href = this.getAttribute("href");
        }
        let hrefAttribute = "";
        if (href !== "") {
            hrefAttribute = ` href="${href}" target="_self"`;
        }
        
        // 创建影子根
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
<div style="padding: 0.5rem;">
    <a${hrefAttribute} style="text-decoration: none; color: rgb(var(--mdui-color-on-primary-container)); font-weight: bold">
        <mdui-card style="width: 100%; padding: 0.5rem;  text-align: center;">
            ${name}
        </mdui-card>
    </a>
</div>
        `.trim();
    }
}
// 注册自定义元素 tool-card
customElements.define('tool-card', ToolCard);