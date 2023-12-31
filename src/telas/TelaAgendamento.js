import FormAgendamento from "../forms/FormAgendamento";
import Pagina from "../templates/pagina";
import TabelaAgendamento from "../tabelas/TabelaAgendamento";
import { useState, useEffect } from "react";
import { urlBase } from "../utilitarios/definicoes";
import { Alert } from "react-bootstrap";

function TelaAgendamento(props) {
  const [mostraTabela, setMostraTabela] = useState(true);
  const [agendamentos, setAgendamentos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState({
    id: "",
    data: "",
    horario: "",
    cpfUsuario: "",
    listaCampos: [],
  });

  function prepararParaEdicao(agendamento) {
    setModoEdicao(true);
    setAgendamentoEmEdicao(agendamento);
    setMostraTabela(false);
  }

  function apagarAgendamento(idAgendamento) {
    const dadosDeletar = {
      agendamento_campo: {
        idAgendamento: idAgendamento,
      },
      agendamento: {
        id: idAgendamento,
      },
    };
    fetch(urlBase, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosDeletar),
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
