let jogador1, jogador2;
let ataqueAtual = null;
let turno = "ataque1";

class Personagem {
  constructor(nome, poder, vida, mana, acerto, defesa) {
    this.nome = nome;
    this.poder = poder;
    this.vida = vida;
    this.mana = mana;
    this.acerto = acerto;
    this.defesa = defesa;
  }
}

function adicionarMensagem(texto) {
  const battleLog = document.getElementById('battle-log');
  const p = document.createElement('p');
  p.innerHTML = texto;
  battleLog.appendChild(p);
  battleLog.scrollTop = battleLog.scrollHeight;
}

function atualizarPainel() {
  document.getElementById('info1').innerHTML = `
    <h3>${jogador1.nome}</h3>
    ❤️ Vida: ${jogador1.vida}<br>
    🔵 Mana: ${jogador1.mana}<br>
    🎯 Acerto: ${jogador1.acerto}<br>
    🛡️ Defesa: ${jogador1.defesa}
  `;
  document.getElementById('info2').innerHTML = `
    <h3>${jogador2.nome}</h3>
    ❤️ Vida: ${jogador2.vida}<br>
    🔵 Mana: ${jogador2.mana}<br>
    🎯 Acerto: ${jogador2.acerto}<br>
    🛡️ Defesa: ${jogador2.defesa}
  `;
}

function calcularPontosRestantes(idPrefixo) {
  const vida = parseInt(document.getElementById(`vida${idPrefixo}`).value) || 0;
  const mana = parseInt(document.getElementById(`mana${idPrefixo}`).value) || 0;
  const acerto = parseInt(document.getElementById(`acerto${idPrefixo}`).value) || 0;
  const defesa = parseInt(document.getElementById(`defesa${idPrefixo}`).value) || 0;
  return 500 - (vida + mana + acerto + defesa);
}

function validarDistribuicao() {
  const pontos1 = calcularPontosRestantes(1);
  const pontos2 = calcularPontosRestantes(2);
  document.getElementById('pontos1').textContent = `Pontos restantes: ${pontos1}`;
  document.getElementById('pontos2').textContent = `Pontos restantes: ${pontos2}`;
  if (pontos1 === 0 && pontos2 === 0) {
    document.getElementById('confirmar-fichas').disabled = false;
    document.getElementById('erro').textContent = "";
  } else {
    document.getElementById('confirmar-fichas').disabled = true;
    if (pontos1 < 0 || pontos2 < 0) {
      document.getElementById('erro').textContent = "❗ Você distribuiu mais de 500 pontos!";
    } else {
      document.getElementById('erro').textContent = "❗ Distribua exatamente 500 pontos!";
    }
  }
}

document.querySelectorAll('input[type=number]').forEach(input => {
  input.addEventListener('input', validarDistribuicao);
});

document.getElementById('confirmar-fichas').addEventListener('click', () => {
  jogador1 = new Personagem(
    document.getElementById('nome1').value,
    document.getElementById('poder1').value,
    parseInt(document.getElementById('vida1').value),
    parseInt(document.getElementById('mana1').value),
    parseInt(document.getElementById('acerto1').value),
    parseInt(document.getElementById('defesa1').value)
  );
  jogador2 = new Personagem(
    document.getElementById('nome2').value,
    document.getElementById('poder2').value,
    parseInt(document.getElementById('vida2').value),
    parseInt(document.getElementById('mana2').value),
    parseInt(document.getElementById('acerto2').value),
    parseInt(document.getElementById('defesa2').value)
  );
  document.getElementById('ficha-container').style.display = 'none';
  document.getElementById('batalha-container').style.display = 'block';
  atualizarTurnos();
  atualizarPainel();
  adicionarMensagem("🎮 Batalha iniciada!");
});

function atualizarTurnos() {
  if (turno.startsWith("ataque")) {
    const atacante = turno === "ataque1" ? jogador1 : jogador2;
    document.getElementById('rolar-ataque').textContent = `🎯 Rolar Ataque de ${atacante.nome}`;
    document.getElementById('rolar-ataque').disabled = false;
    document.getElementById('rolar-defesa').disabled = true;
  } else if (turno.startsWith("defesa")) {
    const defensor = turno === "defesa1" ? jogador1 : jogador2;
    document.getElementById('rolar-defesa').textContent = `🛡️ Rolar Defesa de ${defensor.nome}`;
    document.getElementById('rolar-defesa').disabled = false;
    document.getElementById('rolar-ataque').disabled = true;
  }
}

document.getElementById('rolar-ataque').addEventListener('click', () => {
  if (!(turno === "ataque1" || turno === "ataque2")) {
    alert("⚠️ Não é o momento de atacar!");
    return;
  }
  const atacante = turno === "ataque1" ? jogador1 : jogador2;
  const d20 = Math.floor(Math.random() * 20) + 1;
  const bonus = Math.floor(atacante.acerto * 0.1);
  ataqueAtual = d20 + bonus;
  adicionarMensagem(`🎯 ${atacante.nome} atacou! Dado: ${d20} + Bônus: ${bonus} = ${ataqueAtual}`);
  turno = turno === "ataque1" ? "defesa2" : "defesa1";
  atualizarTurnos();
});

document.getElementById('rolar-defesa').addEventListener('click', () => {
  if (!(turno === "defesa1" || turno === "defesa2")) {
    alert("⚠️ Não é o momento de defender!");
    return;
  }
  const defensor = turno === "defesa1" ? jogador1 : jogador2;
  const d20 = Math.floor(Math.random() * 20) + 1;
  const bonus = Math.floor(defensor.defesa * 0.1);
  const defesa = d20 + bonus;
  adicionarMensagem(`🛡️ ${defensor.nome} defendeu! Dado: ${d20} + Bônus: ${bonus} = ${defesa}`);
  if (ataqueAtual > defesa) {
    const dano = Math.floor(Math.random() * 21) + 10;
    defensor.vida -= dano;
    if (turno === "defesa2") {
      jogador1.mana -= 10;
    } else {
      jogador2.mana -= 10;
    }
    adicionarMensagem(`💥 Ataque bem-sucedido! ${defensor.nome} sofreu ${dano} de dano!`);
  } else {
    adicionarMensagem(`🛡️ Defesa bem-sucedida! ${defensor.nome} não sofreu dano.`);
  }
  if (defensor.vida <= 0 || defensor.mana <= 0) {
    adicionarMensagem(`🏆 ${turno === "defesa2" ? jogador1.nome : jogador2.nome} venceu a batalha!`);
    document.getElementById('acao-container').style.display = 'none';
    return;
  }
  ataqueAtual = null;
  turno = turno === "defesa2" ? "ataque2" : "ataque1";
  atualizarTurnos();
  atualizarPainel();
});
