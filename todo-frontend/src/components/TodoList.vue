<template>
<div>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" @keyup.enter="addTodo" v-model="newTodo" type="text" autofocus="true" autocomplete="off" placeholder="What needs to be done?">
    </header>
    <section class="main" v-show="todos.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" :checked="!anyRemaining" @change="checkAllTodos">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li class="todo" v-for="(todo,index) in todosFiltered" :key="index" :class="{completed: todo.completed, editing: editedTodo == todo}">
          <div class="view">
            <input class="toggle" type="checkbox" @change="updateTodo(todo)" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{todo.title}}</label>
            <button class="destroy" @click="deleteTodo(todo, index)"></button>
          </div>
          <input class="edit" type="text" v-model="todo.title" v-focus @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)">
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
				<span class="todo-count">
					<strong v-text="remaining"></strong> {{pluralize('item', remaining)}} left
				</span>
				<ul class="filters">
					<li><a :class="{selected: filter == 'all'}"  @click="filter = 'all'">All</a></li>
					<li><a :class="{selected: filter == 'active'}" @click="filter = 'active'">Active</a></li>
					<li><a :class="{selected: filter == 'completed'}" @click="filter = 'completed'">Completed</a></li>
				</ul>
				<button class="clear-completed" @click="deleteCompleted" v-show="todos.length > remaining">
					Clear completed
				</button>
    </footer>
  </section>
  <footer class="info">
			<p>Double-click to edit a todo</p>
			<p>Written by <a href="http://github.com/lauroribeiro">Lauro Ribeiro</a></p>
			<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
		</footer>  
</div>
</template>

<script>
  import api from '@/services/api.js'

  export default{
    name: 'TodoList',
    data(){
      return {
        newTodo: '',
        todos: [],
        filter: 'all',
        beforeEditCache: '',
        editedTodo: null,
      }
    },
    computed: {
      remaining: function(){
        return this.todos.filter(todo => !todo.completed).length;
      },
      anyRemaining: function(){
        return this.remaining != 0;
      },
      todosFiltered: function(){
        if (this.filter == 'all') {
          return this.todos;
        } else if (this.filter == 'active') {
          return this.todos.filter(todo => !todo.completed);
        } else if (this.filter == 'completed') {
          return this.todos.filter(todo => todo.completed);
        }
        return this.todos;
      },
    },
    mounted(){
      this.getTodos();
    },
		directives: {
      focus: {
        inserted: function (el) {
          el.focus();
        }
      }
    },
    methods: {
      addTodo: function(){
        if(this.newTodo.trim().length == 0){
          return;
        }
        api.post('/todos', {
          title: this.newTodo
        }).then(response => console.log(response))
          .catch(error => console.log(error));
        this.newTodo = '';
        this.getTodos();
      },
      editTodo: function (todo) {
        this.beforeEditCache = todo.title;
        this.editedTodo = todo;
      },
      doneEdit: function (todo) {
        if (!this.editedTodo) {
          return;
        }
        this.editedTodo = null;
        todo.title = todo.title.trim();
        if (!todo.title) {
          this.cancelEdit(todo);
        }
        this.updateTodo(todo);
      },
      cancelEdit: function(todo) {
        this.editedTodo = null;
        todo.title = this.beforeEditCache;
      },
      updateTodo: function(todo){
        api.patch(`/todos/${todo.id}`,{
          title: todo.title,
          completed: todo.completed
        });
      },
      deleteTodo: function(todo, index){
        api.delete(`/todos/${todo.id}`)
          .then(response => console.log(response))
          .catch(error => console.log(error));
        this.todos.splice(index, 1);        
      },
      deleteCompleted: function(){
        let completed = Array.from(this.todos.filter(todo => todo.completed));
        completed.forEach(todo => {
          const index = this.todos.indexOf(todo);
          this.deleteTodo(todo, index)});
      },  
      getTodos: function(){
        api.get('/todos')
          .then(response => this.todos = response.data)
          .catch(error => console.log(error));
      },
      checkAllTodos() {
        this.todos.forEach(todo => {
          todo.completed = event.target.checked
          this.updateTodo(todo)});
      },
      pluralize: function(word, count){
        return word + (count == 1 ? '' : 's');
      }
    },
  }
</script>