const initTodo = () => {

    const renderTitle = ({ title, done }) => {
        if (!done) return title;
        return `<s>${title}</s>`;
    };
    const renderItem = ({ id, title, done }) => `
        <li class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;">
            <input
                class="form-check-input me-2"
                type="checkbox"
                value=""
                ${done ? "checked" : ""}
                onchange="handleTodoChange(event, '${id}')"
            />
            ${renderTitle({ title, done })}
        </li>
    `;
    const noItems = `
        <li class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;">
            <strong>No tasks yet. Try adding one.</strong>
        </li>
    `;

    const refreshList = () => {
        const doRefresh = async () => {
            const list = document.querySelector("#todo-list");

            const resp = await fetch("/todos");
            const todos = await resp.json();
            if (todos.length === 0) {
                list.innerHTML = noItems;
            } else {
                list.innerHTML = todos.map(renderItem).join("");
            }
        };

        doRefresh().catch(err => console.log("Error refreshing list", err));
    };

    const addItem = async () => {
        const input = document.querySelector("#add-input");
        const title = input.value;
        if (!title) return;

        const resp = await fetch("/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                done: false,
            }),
        });
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`${resp.statusText}: ${text}`);
        }

        input.value = "";
        refreshList();
    };

    const handleTodoChange = (ev, id) => {
        const doChange = async () => {
            const resp = await fetch(`/todos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    done: ev.target.checked,
                }),
            });
            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`${resp.statusText}: ${text}`);
            }

            refreshList();
        }

        doChange().catch(err => console.log("Error changing todo done state", err));
    };
    window.handleTodoChange = handleTodoChange;

    const form = document.querySelector("#todo-form");
    form.onsubmit = (ev) => {
        ev.preventDefault();
        addItem().catch(err => console.log("Error adding item", err));
    };


    refreshList();
}

initTodo();
