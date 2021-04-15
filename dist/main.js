let socket = null;

Vue.component("kitty", {
  template: `
    <div class="kitty">
      {{name}}
      <img v-bind:src="profile">
      has {{exp}} experience. <br>Level {{level}}
      <button type="button" @click="add">Add Experience</button>
    </div>`,
  data() {
    return { type: 'kitty' };
  },
  props: { name: String, exp: { type: Number } },
  methods: {
    add: function () {
      socket.emit('upgrade', this.name)
    }
  },
  computed: {
    level: function () {
      if (this.exp < 10) {
        return 1
      } else if (this.exp < 15) {
        return 2
      } else if (this.exp < 25) {
        return 3
      } else {
        return 4
      }
    },
    profile: function () {
      if (this.exp < 10) {
        return 'https://i.imgur.com/Xu6skq1.png'
      } else if (this.exp < 15) {
        return 'https://i.imgur.com/BSMNfmC.png'
      } else if (this.exp < 25) {
        return 'https://i.imgur.com/2lKuYvq.png'
      } else {
        return 'https://i.imgur.com/99N7i4z.png'
      }
    }
  }
});

const App = new Vue({
  el: "#app",
  data: {
    collection: {},
    names: [],
    boxName: '',
    kitties: 0
  },
  methods: {
    addKitty: function () {
      socket.emit('kitty', this.boxName)
      this.boxName = ''
    },
    updateKitty: function (obj) {
      Vue.set(this.collection, obj.name, obj.exp)
    },
  },
  created: function () {
    axios.get('/kitties')
      .then(res => {
        res.data.forEach(kitty => {
          Vue.set(this.collection, kitty.name, kitty.exp)
        })
      })
    socket = io();
  },
  mounted: function () {
    socket.on('kitty', function (obj) {
      App.updateKitty(obj)
    });
    socket.on('upgrade', function (obj) {
      console.log('buzz')
      if (App.collection[obj.name] <= obj.exp) {
        App.updateKitty(obj);
      }
    })
  },
})

