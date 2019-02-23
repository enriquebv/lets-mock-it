<template>
  <div
    class="mock-listed"
    :class="{updating: mock.id === currentUpdating}"
    :title="`/${mock.endpoint}`"
    @click.self="loadMock"
  >
    <span @click="copyEndpoint">/{{ mock.endpoint }}</span>
    <button
      v-tippy="{
        html: `#mock-listed-options-${this.index}`,
        interactive: true,
        reactive: true,
        trigger: 'click',
        placement: 'right',
        theme: 'light menu',
        distance: 3,
        arrow: true
      }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="5" r="1"></circle>
        <circle cx="12" cy="19" r="1"></circle>
      </svg>
      <div :id="`mock-listed-options-${this.index}`" class="mock-listed-options">
        <button v-if="mock.method === 'get'" @click="openEndpoint">View</button>
        <button>{{ activeText }}</button>
        <button class="remove">Remove</button>
      </div>
    </button>
  </div>
</template>

<script>
import copy from "clipboard-copy";

export default {
  props: ["currentUrl", "currentUpdating", "mock", "index"],
  methods: {
    openEndpoint() {
      window.open(`${this.currentUrl}${this.mock.endpoint}`, "_blank");
    },
    tippyConfig() {
      return {
        html: `#mock-listed-options-${this.index}`,
        interactive: true,
        reactive: true,
        trigger: "click",
        arrow: true
      };
    },
    loadMock() {
      this.$emit("load-mock", this.mock.id);
    },
    copyEndpoint() {
      copy(this.fullUrl)
        .then(success => {
          this.$toasted.show("URL Copied!", {
            theme: "toasted-primary",
            position: "top-left",
            duration: 2000
          })
        })
        .catch(error => console.error("Error al copiar", error));
    }
  },
  computed: {
    activeText() {
      return this.mock.active ? "Deactivate" : "Activate";
    },
    fullUrl() {
      return this.currentUrl + this.mock.endpoint;
    }
  }
};
</script>
