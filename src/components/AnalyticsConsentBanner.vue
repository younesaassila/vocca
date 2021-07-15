<template>
  <div v-if="showBanner" class="analytics-consent-banner">
    <p class="message">
      Autorisez-vous l'utilisation de Google Analytics à des fins d'analyse
      d'audiance et de statistiques ?
    </p>

    <div class="btn-container">
      <b-button variant="danger" @click="onDisableGA()">Refuser</b-button>
      <b-button variant="success" @click="onEnableGA()">Autoriser</b-button>
    </div>
  </div>
</template>

<script>
import firebase from "@/firebase";

export default {
  name: "AnalyticsConsentBanner",
  data() {
    return {
      showBanner: false,
    };
  },
  created() {
    const analyticsConsent = this.$cookie.get("ga-pref");

    if (analyticsConsent && analyticsConsent === "1") {
      return firebase.analytics().setAnalyticsCollectionEnabled(true);
    }

    if (analyticsConsent && analyticsConsent === "0") {
      return firebase.analytics().setAnalyticsCollectionEnabled(false);
    }

    return (this.showBanner = true);
  },
  methods: {
    onDisableGA() {
      this.$cookie.set("ga-pref", "0", {
        expires: "1M",
        sameSite: "strict",
        secure: true,
      });
      this.showBanner = false;
      firebase.analytics().setAnalyticsCollectionEnabled(false);
    },
    onEnableGA() {
      this.$cookie.set("ga-pref", "1", {
        expires: "1Y",
        sameSite: "strict",
        secure: true,
      });
      this.showBanner = false;
      firebase.analytics().setAnalyticsCollectionEnabled(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.analytics-consent-banner {
  align-items: center;
  animation: show 500ms ease-out;
  background-color: #ffffff;
  border-radius: 6px;
  bottom: 0;
  box-shadow: 0 3px 10px #0000004d;
  display: flex;
  justify-content: space-between;
  left: 0;
  margin: 0.5rem;
  padding: 1rem;
  position: fixed;
  right: 0;

  .message {
    margin: 1rem;
  }
}

.btn-container {
  text-align: right;

  * {
    margin: 0.5rem;
  }
}

@keyframes show {
  from {
    opacity: 0;
    transform: translate(0, 100%);
  }

  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@media (max-width: 768px) {
  .analytics-consent-banner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
