import NoteContextAwareWidget from "../note_context_aware_widget.js";

const TPL = `<button class="button-widget bx"
      data-bs-toggle="tooltip"
      title=""></button>`;

export default class AbstractButtonWidget extends NoteContextAwareWidget {
    isEnabled() {
        return true;
    }

    constructor() {
        super();

        this.settings = {
            titlePlacement: 'right',
            title: null,
            icon: null,
            onContextMenu: null
        };
    }

    doRender() {
        this.$widget = $(TPL);
        this.tooltip = new bootstrap.Tooltip(this.$widget, {
            html: true,
            title: () => this.getTitle(),
            trigger: 'hover',
            placement: this.settings.titlePlacement,
            fallbackPlacements: [ this.settings.titlePlacement ]
        })

        if (this.settings.onContextMenu) {
            this.$widget.on("contextmenu", e => {
                this.tooltip.hide();

                this.settings.onContextMenu(e);

                return false; // blocks default browser right click menu
            });
        }

        super.doRender();
    }

    getTitle() {
        return typeof this.settings.title === "function"
            ? this.settings.title()
            : this.settings.title;
    }

    refreshIcon() {
        for (const className of this.$widget[0].classList) {
            if (className.startsWith("bx-")) {
                this.$widget.removeClass(className);
            }
        }

        const icon = typeof this.settings.icon === "function"
            ? this.settings.icon()
            : this.settings.icon;

        this.$widget.addClass(icon);
    }

    initialRenderCompleteEvent() {
        this.refreshIcon();
    }

    /** @param {string|function} icon */
    icon(icon) {
        this.settings.icon = icon;
        return this;
    }

    /** @param {string|function} title */
    title(title) {
        this.settings.title = title;
        return this;
    }

    /** @param {string} placement - "top", "bottom", "left", "right" */
    titlePlacement(placement) {
        this.settings.titlePlacement = placement;
        return this;
    }

    onContextMenu(handler) {
        this.settings.onContextMenu = handler;
        return this;
    }
}
