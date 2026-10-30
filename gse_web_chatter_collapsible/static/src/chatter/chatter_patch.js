/** @odoo-module **/

import { Chatter } from "@mail/chatter/web_portal/chatter";
import { patch } from "@web/core/utils/patch";
import { browser } from "@web/core/browser/browser";
import { useEffect, onWillUnmount } from "@odoo/owl";

patch(Chatter.prototype, {
    setup() {
        super.setup(...arguments);
        const stored = browser.localStorage.getItem("odoo_chatter_collapsed");
        // Default to collapsed (true) if not set, otherwise use stored value
        this.state.isChatterCollapsed = stored !== null ? stored === "true" : true;

        useEffect(
            (isCollapsed, isAside, rootEl) => {
                if (!rootEl) {
                    return;
                }
                if (isAside) {
                    this.syncChatterClasses(isCollapsed);
                } else {
                    this.syncChatterClasses(false);
                }
            },
            () => [this.state.isChatterCollapsed, this.props.isChatterAside, this.rootRef?.el]
        );

        onWillUnmount(() => {
            if (this.rootRef?.el) {
                const asideContainer = this.rootRef.el.closest(".o-mail-ChatterContainer.o-aside");
                if (asideContainer) {
                    asideContainer.classList.remove("o-chatter-collapsed");
                }
                const formRenderer = this.rootRef.el.closest(".o_form_renderer");
                if (formRenderer) {
                    formRenderer.classList.remove("o-chatter-collapsed");
                }
            }
        });
    },

    get isChatterCollapsed() {
        return Boolean(this.props.isChatterAside && this.state.isChatterCollapsed);
    },

    get tabTopPosition() {
        const saved = browser.localStorage.getItem("odoo_chatter_tab_top");
        return saved ? saved : "160px";
    },

    syncChatterClasses(isCollapsed) {
        if (!this.rootRef?.el) {
            return;
        }
        const asideContainer = this.rootRef.el.closest(".o-mail-ChatterContainer.o-aside");
        if (asideContainer) {
            asideContainer.classList.toggle("o-chatter-collapsed", Boolean(isCollapsed));
        }
        const formRenderer = this.rootRef.el.closest(".o_form_renderer");
        if (formRenderer) {
            formRenderer.classList.toggle("o-chatter-collapsed", Boolean(isCollapsed));
        }
    },

    toggleChatterCollapse() {
        this.state.isChatterCollapsed = !this.state.isChatterCollapsed;
        browser.localStorage.setItem(
            "odoo_chatter_collapsed",
            this.state.isChatterCollapsed ? "true" : "false"
        );
        this.syncChatterClasses(this.state.isChatterCollapsed);
    },

    toggleComposer() {
        if (this.state.isChatterCollapsed) {
            this.state.isChatterCollapsed = false;
            browser.localStorage.setItem("odoo_chatter_collapsed", "false");
            this.syncChatterClasses(false);
        }
        return super.toggleComposer(...arguments);
    },

    scheduleActivity() {
        if (this.state.isChatterCollapsed) {
            this.state.isChatterCollapsed = false;
            browser.localStorage.setItem("odoo_chatter_collapsed", "false");
            this.syncChatterClasses(false);
        }
        return super.scheduleActivity(...arguments);
    },

    onTabPointerDown(ev) {
        // Only trigger on primary button (left click) or touch
        if (ev.button && ev.button !== 0) {
            return;
        }
        const tabEl = ev.currentTarget;
        const startY = ev.clientY;
        const initialTop = tabEl.getBoundingClientRect().top;
        let isDragging = false;

        const onPointerMove = (moveEv) => {
            const deltaY = moveEv.clientY - startY;
            if (Math.abs(deltaY) > 4) {
                if (!isDragging) {
                    isDragging = true;
                    tabEl.classList.add("is-dragging");
                }
            }
            if (isDragging) {
                const viewportHeight = window.innerHeight;
                const tabHeight = tabEl.offsetHeight || 38;
                let newTop = initialTop + deltaY;
                // Clamp within comfortable bounds (avoiding top navbar and bottom edges)
                newTop = Math.max(50, Math.min(viewportHeight - tabHeight - 20, newTop));
                tabEl.style.top = `${newTop}px`;
            }
        };

        const onPointerUp = () => {
            tabEl.classList.remove("is-dragging");
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);

            if (isDragging) {
                // Save new vertical position
                const currentTop = tabEl.style.top;
                if (currentTop) {
                    browser.localStorage.setItem("odoo_chatter_tab_top", currentTop);
                }
            } else {
                // Was a quick click/tap: toggle chatter
                this.toggleChatterCollapse();
            }
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
    },
});
