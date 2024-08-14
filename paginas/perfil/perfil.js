document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();

    auth.onAuthStateChanged(user => {
        if (user) {
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');

            profileName.textContent = user.displayName || 'Usuário sem nome';
            profileEmail.textContent = user.email;
        } else {
            window.location.href = 'login.html';
        }
    });
});

function editarPerfil() {
    const newName = prompt('Digite o novo nome:');
    if (newName) {
        const user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: newName
        }).then(() => {
            document.getElementById('profile-name').textContent = newName;
            alert('Nome atualizado com sucesso!');
        }).catch(error => {
            console.error('Erro ao atualizar o nome:', error);
        });
    }
}

function logout() {
        window.location.href = '../../../../index.html';
}
