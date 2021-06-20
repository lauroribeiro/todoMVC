<template>
  <div class="container">
    <TodoList />
  </div>
</template>

<script>
import './styles/global.css'
import TodoList from './components/TodoList'
export default {
  name: 'App',
  components: {
    TodoList,
  }
}
</script>


