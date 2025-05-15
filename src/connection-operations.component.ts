import { component, css, di, html } from 'fudgel';
import { MessageService } from './services/message.service';

component('connection-operations', {
    style: css`
    `,
    template: html`
        <button
            @click="close()"
        >
            Disconnect
        </button>
    `,
}, class {
    _messageService = di(MessageService);
});
