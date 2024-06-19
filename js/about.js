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
// 支持超链接的卡片 HTMLElement
class ItemCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // 获取链接
        let href = "#";
        if (this.hasAttribute("href")) {
            href = this.getAttribute("href");
        }
        let hrefAttribute = "";
        if (href !== "") {
            hrefAttribute = ` href="${href}" target="_blank"`;
        }
        
        // 创建影子根
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
<div style="padding: 0.5rem;">
    <a${hrefAttribute} style="text-decoration: none; color: rgb(var(--mdui-color-on-primary-container)); font-weight: bold">
        <mdui-card style="width: 100%; padding: 0.5rem;  text-align: center;">
            <slot></slot>
        </mdui-card>
    </a>
</div>
        `.trim();
    }
}
// 注册自定义元素 item-card
customElements.define('item-card', ItemCard);

// Github icon element
class GithubIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<mdui-icon><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" enable-background="new 0 0 36 36" xml:space="preserve" style="width: 1.5rem; height: 1.5rem;"><path fill-rule="evenodd" clip-rule="evenodd" d="M18,1.4C9,1.4,1.7,8.7,1.7,17.7c0,7.2,4.7,13.3,11.1,15.5c0.8,0.1,1.1-0.4,1.1-0.8c0-0.4,0-1.4,0-2.8c-4.5,1-5.5-2.2-5.5-2.2c-0.7-1.9-1.8-2.4-1.8-2.4c-1.5-1,0.1-1,0.1-1c1.6,0.1,2.5,1.7,2.5,1.7c1.5,2.5,3.8,1.8,4.7,1.4c0.1-1.1,0.6-1.8,1-2.2c-3.6-0.4-7.4-1.8-7.4-8.1c0-1.8,0.6-3.2,1.7-4.4c-0.2-0.4-0.7-2.1,0.2-4.3c0,0,1.4-0.4,4.5,1.7c1.3-0.4,2.7-0.5,4.1-0.5c1.4,0,2.8,0.2,4.1,0.5c3.1-2.1,4.5-1.7,4.5-1.7c0.9,2.2,0.3,3.9,0.2,4.3c1,1.1,1.7,2.6,1.7,4.4c0,6.3-3.8,7.6-7.4,8c0.6,0.5,1.1,1.5,1.1,3c0,2.2,0,3.9,0,4.5c0,0.4,0.3,0.9,1.1,0.8c6.5-2.2,11.1-8.3,11.1-15.5C34.3,8.7,27,1.4,18,1.4z"></path></svg></mdui-icon>`;
    }
}
// 注册自定义元素 mdui-icon-github
customElements.define('mdui-icon-github', GithubIcon);

function openImageDialog(url = "./img/icon-200x200.png", title = false) {
    let imageDialogElement = document.getElementById('image-dialog');
    let imageElement = document.querySelector('#image-dialog img');
    imageElement.src = url;
    imageElement.alt = title;
    imageDialogElement.headline = title;
    imageDialogElement.open = true;
}