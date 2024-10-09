
fetch('config.json')
  .then(response => response.json())
  .then(config => {
    const adminEmail = atob(config.adminEmail);

    firebase.auth().onAuthStateChanged((user) => {
      const connectButton = document.getElementById('connect-button');
      const profileButton = document.getElementById('profile-button');
      const logoutButton = document.getElementById('logout-button');
      const addprodutoButton = document.getElementById('addproduto-button');
      const cartButton = document.getElementById('cart-button');

      if (user) {
        connectButton.style.display = 'none';
        profileButton.style.display = 'block';
        logoutButton.style.display = 'block';
        addprodutoButton.style.display = 'block';
        cartButton.style.display = 'block';

        if (user.email === adminEmail) {
          document.getElementById('addproduto-button').style.display = 'block';
        } else {
          document.getElementById('addproduto-button').style.display = 'none';
        }
      } else {
        connectButton.style.display = 'block';
        profileButton.style.display = 'none';
        logoutButton.style.display = 'none';
        addprodutoButton.style.display = 'none';
        cartButton.style.display = 'none';
      }
    });
  })
  .catch(error => {
    console.error("Erro ao carregar o arquivo JSON:", error);
  });


function cadastrarproduto() {
  window.location.href = "cadastroproduto.html";
}

function voltarindex() {
  window.location.href = "../../index.html";
}

function goToLogin() {
  window.location.href = "paginas/login/login.html";
}

function goToProfile() {
  window.location.href = "paginas/perfil/perfil.html";
}
function goCarrinho() {
  window.location.href = "paginas/carrinho/carrinho.html";
}
function logout() {
  firebase.auth().signOut()
    .then(() => {

      updateUIOnAuthStateChanged(null);
    })
    .catch((error) => {

      console.log("Erro ao fazer logout:", error);
    });
}



function getProducts(categoria) {
  return firebase.firestore().collection(categoria).get();
}

function exibirProdutos(categoria, containerId) {
    getProducts(categoria).then(snapshot => {
        const container = document.getElementById(containerId);
        snapshot.docs.forEach(doc => {
            const produto = doc.data();
            const produtoElement = document.createElement('div');
            produtoElement.style.display = 'flex';
            produtoElement.style.flexDirection = 'column';
            produtoElement.style.alignItems = 'center';
            produtoElement.style.border = '1px solid #ccc';
            produtoElement.style.padding = '10px';
            produtoElement.style.margin = '10px';
            produtoElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

            const fotoPath = `${categoria}/${produto.foto}`;
            const storageRef = firebase.storage().ref();
            const fotoRef = storageRef.child(fotoPath);

            fotoRef.getDownloadURL().then(url => {
                const img = document.createElement('img');
                img.src = url;
                img.alt = 'foto';
                img.style.width = '200px';
                img.style.marginBottom = '10px'; 

                produtoElement.appendChild(img);

                const detalhesProduto = document.createElement('div');
                detalhesProduto.innerHTML = `
                    <h3>${doc.id}</h3>
                    <p><b>Descrição:</b> ${produto.descricao}</p>
                    <p><b>Preço:</b> ${produto.valor}</p>
                    <p><b>Quantidade:</b> ${produto.quantidade}</p>
                    <p><b>Especificações:</b> ${produto.especificacoes}</p>
                `;
                const user = firebase.auth().currentUser;
                const button = document.createElement('button');

                if (user) {
                    button.textContent = 'Adicionar ao Carrinho';
                    button.className = 'carrinho-btn';
                    button.onclick = () => adicionarnocarrinho(categoria, doc.id, produto.valor, produto.quantidade);
                } else {
                    button.textContent = 'Faça login para comprar';
                    button.disabled = true;
                    button.style.cursor = 'not-allowed';
                }

                detalhesProduto.appendChild(button);
              
                produtoElement.appendChild(detalhesProduto);
                container.appendChild(produtoElement);
            }).catch(error => {
                console.error('Erro ao obter a URL da foto:', error);
            });
        });
    }).catch(error => {
        console.error('Erro ao buscar produtos:', error);
    });
}










function adicionarnocarrinho(categoria, id, valor, estoque) {
  const quantidadeDesejada = prompt(`Quantos produtos você deseja adicionar ao carrinho?`);
  const quantidade = parseInt(quantidadeDesejada, 10);

  if (isNaN(quantidade) || quantidade <= 0 || quantidade > estoque) {
      alert('Quantidade inválida ou maior que o estoque disponível.');
      return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === id && item.categoria === categoria);

  if (itemIndex > -1) {
      cart[itemIndex].quantidade += quantidade;
  } else {
      cart.push({ categoria, id, valor, quantidade });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Produto adicionado ao carrinho!');
  console.log('Carrinho:', cart);
}







exibirProdutos('Notebooks', 'notebook-list');
exibirProdutos('Teclados', 'teclado-list');
exibirProdutos('Mouses', 'mouse-list');


function salvarproduto() {
  let colecao1 = document.getElementById("colecao").value;
  let nome1 = (document.getElementById("nome").value);
  let descricao1 = (document.getElementById("descricao").value);
  let preco1 = (document.getElementById("preco").value);
  let quantidade1 = parseFloat(document.getElementById("quantidade").value);
  let especificacoes1 = (document.getElementById("especificacoes").value);
  let foto = document.getElementById("foto").files[0];  

  if (!foto) {
      alert('Por favor, selecione uma imagem.');
      return;
  }

  const storageRef = firebase.storage().ref();
  const fotoRef = storageRef.child(`${colecao1}/${foto.name}`);

  fotoRef.put(foto).then(snapshot => {
      return snapshot.ref.getDownloadURL();  
  }).then(fotoURL => {

  db.collection(colecao1).doc(nome1).set({
    descricao: descricao1,
    valor: preco1,
    quantidade: quantidade1,
    especificacoes: especificacoes1,
    foto: foto.name,
  })
  alert('Produto Salvo no Banco de Dados!');
})}


function excluirproduto() {
  let colecao1 = document.getElementById("colecaoDEL").value;
  let nome1 = (document.getElementById("nomeDEL").value);

  

  db.collection(colecao1).doc(nome1).delete().then(() => {
    console.log("Produto removido do BANCO DE DADOS!");
    alert("Produto removido do BANCO DE DADOS!");
  }).catch((error) => {
    console.error("Erro ao remover o documento: ", error);
  });
  
}


function getProducts(collection) {
  return db.collection(collection).get()
    .then((snapshot) => {
      console.log(snapshot);
      return snapshot;
    })
    .catch((error) => {
      console.error('Erro ao obter os produtos:', error);
      throw error;
    });}




    document.addEventListener('DOMContentLoaded', () => {
      const searchButton = document.getElementById('searchButton');
      const searchInput = document.getElementById('searchInput');
      const searchResults = document.getElementById('search-results');
      const backButton = document.getElementById('backButton');
  
      searchButton.addEventListener('click', () => {
          const query = searchInput.value.trim().toLowerCase();
          searchResults.innerHTML = ''; 
          if (query) {
              searchResults.style.display = 'block';
              backButton.style.display = 'block';
  
              const categorias = ['Notebooks', 'Mouses', 'Teclados'];
              let resultadoEncontrado = false;
  
              categorias.forEach(categoria => {
                  getProducts(categoria).then(snapshot => {
                      snapshot.docs.forEach(doc => {
                          const produto = doc.data();
                          const nomeProduto = doc.id.toLowerCase();
  
                          if (nomeProduto.includes(query) || produto.descricao.toLowerCase().includes(query)) {
                              resultadoEncontrado = true;
  
                              const produtoElement = document.createElement('div');
                              produtoElement.style.border = '1px solid #ccc';
                              produtoElement.style.padding = '10px';
                              produtoElement.style.margin = '10px';
  
                              const fotoPath = `${categoria}/${produto.foto}`;
                              const storageRef = firebase.storage().ref();
                              const fotoRef = storageRef.child(fotoPath);
  
                              fotoRef.getDownloadURL().then(url => {
                                  const img = document.createElement('img');
                                  img.src = url;
                                  img.alt = 'foto';
                                  img.style.width = '150px';
                                  img.style.marginBottom = '10px'; 
  
                                  produtoElement.appendChild(img);
  
                                  const detalhesProduto = document.createElement('div');
                                  detalhesProduto.innerHTML = `
                                      <h3>${doc.id}</h3>
                                      <p><b>Descrição:</b> ${produto.descricao}</p>
                                      <p><b>Preço:</b> ${produto.valor}</p>
                                      <p><b>Quantidade:</b> ${produto.quantidade}</p>
                                  `;
                                  const button = document.createElement('button');
  
                                  if (firebase.auth().currentUser) {
                                      button.textContent = 'Adicionar ao Carrinho';
                                      button.className = 'carrinho-btn';
                                      button.onclick = () => adicionarnocarrinho(categoria, doc.id, produto.valor, produto.quantidade);
                                  } else {
                                      button.textContent = 'Faça login para comprar';
                                      button.disabled = true;
                                      button.style.cursor = 'not-allowed';
                                  }
  
                                  detalhesProduto.appendChild(button);
                                  produtoElement.appendChild(detalhesProduto);
                                  searchResults.appendChild(produtoElement);
                              }).catch(error => {
                                  console.error('Erro ao obter a URL da foto:', error);
                              });
                          }
                      });
                  }).catch(error => {
                      console.error('Erro ao buscar produtos:', error);
                  });
              });
          }
      });
  
      backButton.addEventListener('click', () => {
          searchResults.style.display = 'none';
          backButton.style.display = 'none';
          searchInput.value = '';
      });
  });
  
