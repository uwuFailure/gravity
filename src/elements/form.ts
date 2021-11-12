import { body, colors } from '../main';
import btn from './create-btn';

export default async function(prompt: string): Promise<{ name: string, description?: string}> {
    return new Promise((resolve, reject) => {
        const status = document.createElement('div');
        status.style.fontSize = '14px';
        
        function ok() {
            const charsValid = textbox.value.match(/^[A-Za-z0-9\-_:&$\+~`!#\?\. ]+$/g);
            const shortEnough = textbox.value.length <= 48;
            const dv = description.value;
            const descriptionNoContain = dv.indexOf('<') === -1 && dv.indexOf('>') === -1;
            const descriptionShortEnough = dv.length <= 2048;
            if(charsValid && shortEnough && descriptionNoContain && descriptionShortEnough) {
                cleanup();
                resolve({ name: textbox.value, description: dv });
            } else {
                status.textContent = '';
                const msg = document.createElement('div');
                msg.className = 'widget-text';
                const icon = document.createElement('i');
                icon.className = 'bi bi-x-circle-fill';
                icon.style.color = colors.RED;
                msg.appendChild(icon);
                if(!charsValid) {
                    msg.appendChild(document.createTextNode(' Level name contains unacceptable characters.'));
                } else if(!shortEnough) {
                    msg.appendChild(document.createTextNode(' Level name must not exceed 48 characters.'));
                } else if(!descriptionNoContain) {
                    msg.appendChild(document.createTextNode(' Level description must not contain "<" or ">".'));
                } else {
                    msg.appendChild(document.createTextNode(' Level description must not exceed 2048 characters.'));
                }
                msg.style.color = colors.RED;
                status.appendChild(msg);
            }
        }

        function cancel() {
            cleanup();
            reject();
        }

        function listener(e: KeyboardEvent) {
            if(e.key === 'Escape') {
                cancel();
            }
        }

        function cleanup() {
            body.removeChild(parent);
            body.removeChild(blockingEl);
            document.removeEventListener('keyup', listener);
        }

        document.addEventListener('keyup', listener);

        const content = document.createElement('div');
        content.className = 'widget-content';

        const blockingEl = document.createElement('div');
        blockingEl.className = 'background-blocker';
        body.appendChild(blockingEl);

        const parent = document.createElement('div');
        parent.style.width = '360px'
        parent.className = 'widget center';
        const textParent = document.createElement('div');
        textParent.className = 'widget-text';
        textParent.appendChild(document.createTextNode(prompt));
        content.appendChild(textParent);

        const textbox = document.createElement('input');
        textbox.type = 'text';
        textbox.className = 'widget-text-box';
        textbox.addEventListener('keyup', (e) => {
            if(e.key === 'Enter') {
                ok();
            }
        });

        const description = document.createElement('textarea');
        description.className = 'widget-text-box widget-textarea';
        description.placeholder = 'No description provided';

        const textDescription = document.createElement('div');
        textDescription.className = 'widget-text';
        textDescription.textContent = 'Description (optional)';
        
        content.appendChild(textbox);
        content.appendChild(status);

        content.appendChild(textDescription);
        content.appendChild(description);

        const buttons = document.createElement('div');
        buttons.className = 'widget-btns';
        buttons.appendChild(btn('Ok', ok));
        buttons.appendChild(btn('Cancel', cancel));
        content.appendChild(buttons);
        parent.appendChild(content);
        body.appendChild(parent);
    });
}