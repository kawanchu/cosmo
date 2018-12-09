import axiosBase from 'axios';

const axios = axiosBase.create({
  baseURL: 'http://127.0.0.1:21982',
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

export async function getPosts() {
  const res = await axios.get('/posts', {
    headers: {
//      'Ontology-Subject': 'AecaeSEBkt5GcBCxwz1F41TvdjX3dnKBkJ',
    },
  });

  // TODO: add error handling
  return res.data;
}

export async function putPosts(posts) {
  // TODO: fix N+1
  for (const post of posts) {
    await axios.put(`/posts/${post.id}`, post, {
      headers: {
        'Ontology-Subject': 'AecaeSEBkt5GcBCxwz1F41TvdjX3dnKBkJ',
      },
    });
  }
}
