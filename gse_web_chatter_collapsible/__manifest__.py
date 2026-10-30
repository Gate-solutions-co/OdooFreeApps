# -*- coding: utf-8 -*-
{
    'name': 'GSE Collapsible & Draggable Chatter (Log & History)',
    'version': '19.0.1.0.0',
    'category': 'Discuss',
    'summary': 'Collapse & expand chatter sidebar with draggable vertical tab to maximize form width',
    'description': """
GSE Collapsible & Draggable Chatter (Log & History) for Odoo 19
================================================================
Maximize your workspace on every form view with an intuitive, collapsible, and draggable chatter panel.

Key Features:
-------------
* **1-Click Collapse & Expand:** Quickly collapse the side chatter (messages, log notes, planned activities) to give 100% full screen width to your form views.
* **Compact Handle (Arrow & Icon):** Minimalist, unobtrusive floating tab showing only the arrow and chat icon.
* **Draggable Up & Down:** Drag the collapsed tab vertically along the edge to place it wherever you find most comfortable.
* **Auto Full-Width Sheet:** Automatically removes notebook tab horizontal scrolling by expanding the form sheet container to full width.
* **Persistent Preferences:** Remembers both your open/closed state and vertical tab position in browser localStorage.
* **Smart Auto-Expand:** Automatically reopens the chatter when clicking "Send message", "Log note", or "Activity" (including hotkeys `m`, `shift+m`, `shift+a`).
* **Full RTL / Arabic Compatibility:** Natively handles right-to-left layout and Arabic language interfaces.

Developed with care by Gate Solutions.
Support: gate.solutions.eg@gmail.com
    """,
    'author': 'Gate Solutions',
    'maintainer': 'Gate Solutions',
    'support': 'gate.solutions.eg@gmail.com',
    'license': 'LGPL-3',
    'price': 0.00,
    'currency': 'USD',
    'depends': [
        'web',
        'mail',
    ],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'gse_web_chatter_collapsible/static/src/chatter/chatter_patch.js',
            'gse_web_chatter_collapsible/static/src/chatter/chatter_patch.xml',
            'gse_web_chatter_collapsible/static/src/chatter/chatter_collapsible.scss',
        ],
    },
    'images': [
        'static/description/banner.png',
    ],
    'installable': True,
    'application': False,
    'auto_install': True,
}
