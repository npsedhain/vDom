import { createElement } from "./lib/createElement.js";
import Component from "./lib/Component.js";

class ToDoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inEditMode: false
    };
  }

  componentDidUpdate() {
    if (this.input) {
      this.input.focus();
    }
  }

  goToEditMode() {
    this.setState({
      inEditMode: true
    });
  }

  leaveEditMode() {
    this.setState({
      inEditMode: false
    });
  }

  render() {
    return createElement(
      "div",
      {
        class: "todo"
      },
      this.state.inEditMode
        ? [
            createElement("input", {
              class: "edit",
              ref: input => {
                if (input) {
                  this.input = input;
                }
              },
              onKeyDown: e => {
                if (e.which === 13) {
                  this.input.blur();
                }
              },
              onBlur: e => {
                const text = e.target.value;
                if (!text.length) {
                  this.props.onDestroy(e);
                } else {
                  this.props.onEdit(e.target.value);
                  this.leaveEditMode();
                }
              },
              value: this.props.text
            })
          ]
        : [
            createElement("div", { class: "view" }, [
              createElement("input", {
                onChange: e => {
                  e.preventDefault();
                  this.props.onClick(e.target.checked);
                },
                type: "checkbox",
                class: "toggle",
                checked: this.props.completed
              }),
              createElement(
                "label",
                {
                  onDblClick: this.props.completed
                    ? () => {}
                    : this.goToEditMode.bind(this),
                  class: `text ${this.props.completed ? "completed" : ""}`
                },
                [this.props.text]
              ),
              createElement("button", {
                class: "destroy",
                onClick: this.props.onDestroy
              })
            ])
          ]
    );
  }
}

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };
  }

  componentWillReceiveProps() {
    console.log("willreceiveprops");
  }

  componentWillMount() {
    console.log("willmount");
  }

  componentWillUnmount() {
    console.log("willunmount");
  }

  componentWillUpdate() {
    console.log("willupdate");
  }

  componentDidMount() {
    console.log("didMount");
    this.setState({ value: " a default todo!" });
  }

  componentDidUpdate() {
    console.log("didupdate");
  }

  render() {
    console.log("render");
    return createElement(
      "header",
      {
        class: "header"
      },
      [
        this.props.showToggle
          ? createElement("input", {
              name: "toggle-all",
              class: "toggle-all",
              type: "checkbox",
              onChange: e => {
                this.props.onToggleAll(e.target.checked);
              },
              checked: this.props.allCompleted
            })
          : null,
        createElement(
          "form",
          {
            class: "new-todo",
            onSubmit: e => {
              e.preventDefault();
              e.stopPropagation();
              if (this.state.value) {
                const value = this.state.value;
                this.setState({ value: "" });
                this.props.onClick(value);
                this.input.focus();
              }
            }
          },
          [
            createElement("input", {
              class: "text-input",
              ref: input => {
                if (input) {
                  this.input = input;
                }
              },
              onChange: e => {
                this.setState({ value: e.target.value });
              },
              placeholder: "What needs to be done?",
              value: this.state.value
            }),
            createElement("input", {
              class: "submit",
              type: "submit"
            })
          ]
        )
      ]
    );
  }
}

export default class ToDoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "all",
      todos: []
    };

    this.filters = {
      all: todo => todo,
      active: todo => !todo.completed,
      completed: todo => todo.completed
    };
  }

  deleteCompleted() {
    this.setState({
      todos: this.state.todos.filter(todo => !todo.completed)
    });
  }

  deleteTodo(deletedTodo) {
    this.setState({
      todos: this.state.todos.filter(todo => todo.id !== deletedTodo.id)
    });
  }

  completeTodo(completedTodo, value) {
    this.setState({
      todos: this.state.todos.map(todo => {
        if (completedTodo.id !== todo.id) return todo;

        return Object.assign({}, todo, {
          completed: value
        });
      })
    });
  }

  addTodo(text) {
    this.setState({
      todos: this.state.todos.concat([
        {
          text,
          id: Math.random().toString(),
          completed: false
        }
      ])
    });
  }

  editTodo(editedTodo, newText) {
    this.setState({
      todos: this.state.todos.map(todo => {
        if (editedTodo.id !== todo.id) return todo;

        return Object.assign({}, todo, {
          text: newText
        });
      })
    });
  }

  numOfUnCompleted() {
    return this.state.todos.filter(todo => !todo.completed).length;
  }

  toggleAll(value) {
    this.setState({
      todos: this.state.todos.map(todo =>
        Object.assign({}, todo, {
          completed: value
        })
      )
    });
  }

  render() {
    const numOfUnCompleted = this.numOfUnCompleted();
    return createElement(
      "div",
      {
        class: "container"
      },
      [
        createElement(
          "section",
          {
            class: "todoapp"
          },
          [
            createElement(Input, {
              onClick: this.addTodo.bind(this),
              onToggleAll: this.toggleAll.bind(this),
              allCompleted: numOfUnCompleted === 0,
              showToggle: this.state.todos.length > 0
            }),
            createElement(
              "ul",
              {
                class: "todo-list"
              },
              [
                this.state.todos
                  .filter(this.filters[this.state.filter])
                  .map(todo =>
                    createElement(
                      "li",
                      {
                        key: todo.id
                      },
                      [
                        createElement(
                          ToDoItem,
                          Object.assign(
                            {
                              onClick: value => {
                                this.completeTodo(todo, value);
                              },
                              onEdit: newValue => {
                                this.editTodo(todo, newValue);
                              },
                              onDestroy: () => {
                                this.deleteTodo(todo);
                              }
                            },
                            todo
                          )
                        )
                      ]
                    )
                  )
              ]
            ),
            this.state.todos.length < 1
              ? null
              : createElement(
                  "footer",
                  {
                    class: "footer"
                  },
                  [
                    createElement(
                      "span",
                      {
                        class: "todo-count"
                      },
                      [
                        `${numOfUnCompleted} item${
                          numOfUnCompleted === 1 ? "" : "s"
                        } left`
                      ]
                    ),
                    createElement(
                      "ul",
                      {
                        class: "filters"
                      },
                      [
                        Object.keys(this.filters).map(filter =>
                          createElement("li", { key: filter }, [
                            createElement(
                              "a",
                              {
                                class:
                                  this.state.filter === filter
                                    ? "selected"
                                    : null,
                                onClick: () => {
                                  this.setState({
                                    filter
                                  });
                                }
                              },
                              [filter]
                            )
                          ])
                        )
                      ]
                    ),
                    this.state.todos.length > this.numOfUnCompleted()
                      ? createElement(
                          "button",
                          {
                            class: "clear-completed",
                            onClick: this.deleteCompleted.bind(this)
                          },
                          ["Clear completed"]
                        )
                      : null
                  ]
                )
          ]
        )
      ]
    );
  }
}
