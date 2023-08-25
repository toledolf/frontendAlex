import FormAgendamento from "../forms/FormAgendamento";
import BarraBusca from "../forms/BarraBusca";
import Pagina from "../templates/pagina";
import TabelaAgendamento from "../tabelas/TabelaAgendamento";
import { useState, useEffect } from "react";
import { urlBase, urlBase2 } from "../utilitarios/definicoes";
import { Alert } from "react-bootstrap";

function TelaAgendamento(props) {
  const [mostraTabela, setMostraTabela] = useState(true);
  const [agendamentos, setAgendamentos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState({
    id: "",
    campo: "",
    data: "",
    horario: "",
    usuario: "",
  });

  function prepararParaEdicao(agendamento) {
    setModoEdicao(true);
    setAgendamentoEmEdicao(agendamento);
    setMostraTabela(false);
  }

  function apagarAgendamento(agendamento) {
    fetch(urlBase, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agendamento),
    }).then((resposta) => {
      window.alert("Agendamento Deletado com sucesso!!!");
      window.location.reload();
      return resposta.json();
    });
  }

  useEffect(() => {
    fetch(urlBase, {
      method: "GET",
    })
      .then((resp) => {
        return resp.json();
      })
      .then((dados) => {
        if (Array.isArray(dados)) {
          setAgendamentos(dados);
        } else {
        }
      });
  }, []);

  const [clienteSelecionado, setClienteSelecionado] = useState({});
  const [ListaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    fetch(urlBase2)
      .then((resposta) => resposta.json())
      .then((dados) => {
        setListaUsuarios(dados);
      });
  }, []);

  return (
    <Pagina>
      <Alert
        variant={"secondary"}
        className="text-center m-3"
      >
        Agendamento de Espaço
      </Alert>
      {mostraTabela ? (
        <TabelaAgendamento
          listaAgendamentos={agendamentos}
          setAgendamentos={setAgendamentos}
          mostraTabela={setMostraTabela}
          editarAgendamento={prepararParaEdicao}
          deletarAgendamento={apagarAgendamento}
          modoEdicao={modoEdicao}
        />
      ) : (
        <div>
          <BarraBusca
            placeHolder={"Informe o Nome..."}
            dados={ListaUsuarios}
            campoChave={"cpf"}
            campoBusca={"nome"}
            funcaoSelecao={setClienteSelecionado}
            valor={""}
          />
          <FormAgendamento
            listaAgendamentos={agendamentos}
            setAgendamentos={setAgendamentos}
            editarAgendamentos={prepararParaEdicao}
            mostraTabela={setMostraTabela}
            setModoEdicao={setModoEdicao}
            modoEdicao={modoEdicao}
            agendamento={agendamentoEmEdicao}
          />
        </div>
      )}
    </Pagina>
  );
}

export default TelaAgendamento;