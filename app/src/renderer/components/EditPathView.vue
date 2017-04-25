<template>
  <div class="EditPathView">
    <table class="edit-path-table">
      <thead>
        <th>Directory</th>
        <th>GitHub URL</th>
        <th></th>
      </thead>
      <tbody>
        <row
          v-for="(v, i) of pathList"
          :path-list="pathList"
          :row-data="v"
          :row-index="i"
        ></row>
      </tbody>
    </table>
    <footer class="EditPathView_footer">
      <button @click="addRow" :disabled="pathList.length >= 20">Add row</button>
      <button @click="cancel">Cancel</button>
      <button @click="save">Save</button>
    </footer>
  </div>
</template>

<script>
  import repos from './LandingPageView/scripts/repos';
  import Row from './EditPathView/Row';
  const emptyData = {
    pathName: '',
    github: '',
  };

  export default {
    name: 'edit-path-page',
    components: {
      Row,
    },
    data() {
      return {
        pathList: (() => {
          const retVal = JSON.parse(localStorage.getItem('pathList')) || [];
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
        this.pathList.push(Object.assign({}, emptyData));
      },
      cancel() {
        this.$router.go(-1);
      },
      save() {
        const notEmpty = this.pathList.filter(v => v.pathName);
        localStorage.setItem('pathList', JSON.stringify(notEmpty));

        this.$router.go(-1);
        repos.init(notEmpty);
      },
    },
  };
</script>

<style lang="scss">
@import "../sass/_theme";

.edit-path-table {
  $padding: 4px 8px;

  width: 100%;
  border-collapse: collapse;
  line-height: 1.1;
  text-align: center;

  > thead {
    white-space: nowrap;
  }

  > tbody tr {
    vertical-align: top;
  }

  th, td {
    @extend %borderColor;
    border-style: solid;
    border-width: 1px 0;
  }

  th {
    padding: $padding;
    font-weight: 500;
  }
  td {
    padding: .75em 0;
  }
}

.EditPathView_footer {
  margin-top: 1em;
  text-align: right;
}

</style>
