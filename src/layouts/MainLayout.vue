<template>
  <q-layout view='hHh lpR fFf'>

    <q-header class='bg-primary text-white'>
      <q-toolbar>
        <q-btn dense
               flat
               round
               icon='menu'
               @click='toggleLeftDrawer' />

        <q-toolbar-title>
          <q-avatar>
            <img src='https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg'>
          </q-avatar>
          Expenses App
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above
              v-model='leftDrawerOpen'
              side='left'
              bordered>

      <!-- left nav -->
      <q-list>
        <q-item to='/'
                exact>
          <q-item-section avatar>
            <q-icon name='fas fa-wallet'></q-icon>
          </q-item-section>
          <q-item-section>
            Transactions
          </q-item-section>
        </q-item>

        <q-item to='/test'
                exact>
          <q-item-section avatar>
            <q-icon name='mdi-help-circle'></q-icon>
          </q-item-section>
          <q-item-section>
            Test
          </q-item-section>
        </q-item>

        <q-separator spaced></q-separator>
        <q-item-label header>Settings</q-item-label>

        <q-item v-for='link in leftLinks' :key='link.label'>
          <q-item-section avatar><q-icon :name='link.icon'></q-icon></q-item-section>
          <q-item-section>{{link.label}}</q-item-section>
        </q-item>
      </q-list>

    </q-drawer>

    <q-page-container>
      <div class='q-pa-md'>
        <router-view />
      </div>
    </q-page-container>

    <q-footer class='bg-grey-8 text-white'>
      <!--      <q-toolbar>
              <q-toolbar-title>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                </q-avatar>
                <div>Title</div>
              </q-toolbar-title>
            </q-toolbar>-->
    </q-footer>

  </q-layout>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      }
    };
  },
  data() {
    return {
      leftLinks: [
        {label: 'Projects', icon: 'fas fa-box', href: '/projects'},
        {label: 'Accounts', icon: 'mdi-bank', href: '/accounts'},
        {label: 'People', icon: 'fas fa-user', href: '/people'},
        {label: 'Categories', icon: 'fas fa-cat', href: '/cats'},
        {label: 'Vendors', icon: 'fas fa-store', href: '/vendors'},
      ]
    }
  }
};
</script>
