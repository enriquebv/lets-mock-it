<template>
  <div
    class="mock-listed"
    :class="{updating: mock.id === currentUpdating, 'not-active': !mock.active}"
    @click="loadMock"
  >
    <span>/{{ mock.endpoint }}</span>
    <button class="copy" @click.stop="copyEndpoint">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      </svg>
    </button>
    <button
      ref="buttonSubmenu"
      v-tippy="{
        html: `#mock-listed-options-${this.mock.id}`,
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
        ref="svgSubmenu"
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
      <div :id="`mock-listed-options-${this.mock.id}`" class="mock-listed-options" ref="submenu">
        <button v-if="mock.method === 'get'" @click="openEndpoint">Open</button>
        <button @click="changeStatus">{{ activeText }}</button>
        <button @click="removeMock" class="remove">Remove</button>
      </div>
    </button>
  </div>
</template>

<script>
import copy from "clipboard-copy";

export default {
  props: ["currentUrl", "currentUpdating", "mock", "index"],
  methods: {
    changeStatus() {
      this.$emit('change-mock-status', {
        id: this.mock.id,
        status: !this.mock.active
      })
    },
    removeMock() {
      const tippy = this.$refs.buttonSubmenu._tippy
      tippy.hide()
      this.$emit('remove-mock', this.mock.id)
    },
    openEndpoint() {
      window.open(`${this.currentUrl}${this.mock.endpoint}`, "_blank");
    },
    tippyConfig() {
      return {
        html: `#mock-listed-options-${this.mock.id}`,
        interactive: true,
        reactive: true,
        trigger: "click",
        arrow: true
      };
    },
    loadMock(event) {
      if (
        event.target === this.$refs.buttonSubmenu ||
        event.target === this.$refs.svgSubmenu
      ) {
        return false
      }

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
    },
    openSubmenu() {
      console.info(this)
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
