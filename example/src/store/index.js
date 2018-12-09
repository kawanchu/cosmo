import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { getPosts, putPosts } from './db';

const blockstack = require('blockstack')
const uuidv4 = require('uuid/v4');
const POSTS_FILE = 'posts.json'

const createStore = () => {
  return new Vuex.Store({
    state: {
      postForm: {
        title: '',
        body: '',
      },
      auth: {
        status: 'not', // pending, signin
        person: null,
      },
      posts: [],
    },
    getters: {
      isAuthenticated(state) {
        return state.auth.status === 'signin'
      },
      authUser(state) {
        const profile = state.auth.person._profile
        return {
          name: profile.name || 'noname',
          imageUrl: profile.image && profile.image[0] && profile.image[0].contentUrl || 'https://gaia.blockstack.org/hub/1KLzSLktx8xV35pR4z5maCBWQiVjG3sUef//avatar-0?0.7366012623625917',
          description: profile.description || 'no description',
        }
      },
      findPost: (state) => (id) => {
        return state.posts.find(post => post.id === id)
      },
      recentPosts(state) {
        return state.posts.sort((p1, p2) => {
          const a = p1.createdAt
          const b = p2.createdAt
          if (a < b) return 1
          if (a > b) return -1
          return 0
        })
      }
    },
    mutations: {
      setAuthPerson(state, person) {
        state.auth.person = person
      },
      setAuthStatus(state, status) {
        state.auth.status = status
      },
      setPosts(state, posts) {
        state.posts = posts
      },
      updatePostForm(state, { attr, val }) {
        state.postForm[attr] = val
      },
      addPost(state, post) {
        state.posts.push(post)
      },
      updatePost(state, post) {
        const idx = this.state.posts.findIndex(p => p.id === post.id)
        this.state.posts.splice(idx, 1, post)
      },
      deletePost(state, post) {
        const idx = state.posts.findIndex(p => p.id === post.id)
        state.posts.splice(idx, 1)
      }
    },
    actions: {
      init({ commit, dispatch }) {
        if (blockstack.isUserSignedIn()) {
          const userData = blockstack.loadUserData()
          const person = new blockstack.Person(userData.profile)
          commit('setAuthPerson', person)
          commit('setAuthStatus', 'signin')
          dispatch('loadPosts')
        } else if (blockstack.isSignInPending()) {
          commit('setAuthStatus', 'pending')
          blockstack.handlePendingSignIn().then(userdata => {
            window.location = window.location.origin
          })
        }
      },
      signIn({ commit }) {
        const redirectURI = `${window.location.origin}`
        const manifestURI = `${window.location.origin}/static/manifest.json`
        const scope = ['store_write']
        blockstack.redirectToSignIn(redirectURI, manifestURI, scope)
      },
      signOut({ commit }) {
        blockstack.signUserOut(window.location.href)
      },
      async loadPosts({ commit }) {
        const posts = await getPosts();
        console.log(posts);
        commit('setPosts', posts)
      },
      createPost({ commit, dispatch }) {
        const d = new Date()
        const post = {
          title: this.state.postForm.title,
          body: this.state.postForm.body,
          id: uuidv4(),
          createdAt: d.toISOString(),
          updatedAt: d.toISOString(),
        }
        commit('addPost', post)
        dispatch('syncPosts')

        return post
      },
      deletePost({ commit, dispatch }, { post }) {
        commit('deletePost', post)
        dispatch('syncPosts')
      },
      syncPosts({ commit }) {
        putPosts(this.state.posts);
      },
      updatePost({ commit, dispatch }, post) {
        const d = new Date()
        post.createdAt = d.toISOString()

        commit('updatePost', post)
        dispatch('syncPosts')
      }
    }
  })
}

export default createStore
