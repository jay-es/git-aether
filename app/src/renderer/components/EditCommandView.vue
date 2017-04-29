<template>
  <div class="EditCommandView">
    <table class="table edit-command-table">
      <thead>
        <th>Label</th>
        <th>Command Line</th>
        <th></th>
      </thead>
      <tbody>
        <row
          v-for="(v, i) of commandList"
          :command-list="commandList"
          :row-data="v"
          :row-index="i"
        ></row>
      </tbody>
    </table>
    <footer class="EditCommandView_footer">
      <button @click="addRow" :disabled="commandList.length >= 20">Add row</button>
      <button @click="cancel">Cancel</button>
      <button @click="save">Save</button>
    </footer>
  </div>
</template>

<script>
  import store from './LandingPageView/scripts/store';
  import Row from './EditCommandView/Row';
  const emptyData = {
    label: '',
    commandLine: '',
  };

  export default {
    name: 'edit-command-page',
    components: {
      Row,
    },
    data() {
      return {
        commandList: (() => {
          const retVal = JSON.parse(localStorage.getItem('commandList')) || [];
          for (let i = 0; i < 3; i++) {
            if (retVal.length >= 20) break;
            retVal.push(Object.assign({}, emptyData));
          }
          return retVal;
        })(),
      };
    },
    methods: {
      addRow() {
        this.commandList.push(Object.assign({}, emptyData));
      },
      cancel() {
        this.$router.go(-1);
      },
      save() {
        const notEmpty = this.commandList.filter(v => v.label);
        localStorage.setItem('commandList', JSON.stringify(notEmpty));

        this.$router.go(-1);
        store.$set(store, 'commandList', notEmpty);
      },
    },
  };
</script>

<style lang="scss">
.edit-command-table {
  text-align: center;

  td {
    padding: .75em 0;
  }
}

.EditCommandView_footer {
  margin-top: 1em;
  text-align: right;
}

</style>
