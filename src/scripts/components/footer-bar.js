class FooterBar extends HTMLElement {

    constructor() {
        super();
        this.shadowDOM = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowDOM.innerHTML = `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                :host {
                    display: block;
                    width: 100%;
                    color: white;
                }
                div {
                    padding: 16px;
                }
                a {
                    font-weight: bolder;
                    text-decoration: none;
                }
                a:hover {
                    color: white;
                }
            </style>
            <div>
                © 2021 Copyright:
                <a href="https://github.com/Erastusms/movie-web" target="_blank">
                    Submission Fundamental FrontEnd Web
                </a>
            </div>`;
    }
}

customElements.define("footer-bar", FooterBar);