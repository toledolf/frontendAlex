import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Container, Table } from "react-bootstrap";
import { urlBase, urlBase2, urlBase3 } from "../utilitarios/definicoes";
import BarraBusca from "./BarraBusca.js";
import CaixaSelecao from "./CaixaSelecao";
import e from "cors";

function FormAgendamento(props) {
  const [validado, setValidado] = useState(false);
  const [agendamento, setAgendamento] = useState(props.agendamento);
  const [modoFormulario, setModoFormulario] = useState(props.modoEdicao ? "PUT" : "POST");

  function manipularInput(e) {
    const elementoForm = e.currentTarget;
    const id = elementoForm.id;
    const valor = elementoForm.value;
    setAgendamento({ ...agendamento, [id]: valor });
  }

  function manipularEnvio(evento) {
    const form = evento.currentTarget;

    if (form.checkValidity()) {
      const usuario = {
        cpf: usuarioSelecionado.cpf,
        nome: usuarioSelecionado.nome,
      };

      const listaCampos = camposSelecionados.map((campo) => ({
        idCampo: campo.id,
      }));

      const dadosParaEnvio = {
        data: agendamento.data,
        horario: agendamento.horario,
        usuario: usuario,
        listaCampos: listaCampos,
      };
      if (!props.modoEdicao) {
        fetch(urlBase, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosParaEnvio),
        })
          .then((resposta) => {
            if (resposta.ok) {
              window.alert("Agendamento cadastrado com sucesso!!!");
              window.location.reload();
              return resposta.json();
            } else {
              window.alert("Usuário não encontrado!!!");
            }
          })
          .catch((error) => {
            console.error(error);
            window.alert(error.message);
          });
      } else {
        dadosParaEnvio.id = agendamento.id;
        fetch(urlBase, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosParaEnvio),
        }).then((resp) => {
          window.alert("Agendamento Atualizado com Sucesso!!!");
          window.location.reload();
          return resp.json();
        });
      }
      setValidado(false);
    } else {
      setValidado(true);
    }

    evento.preventDefault();
    evento.stopPropagation();
  }

  // Barra Busca - Lógica

  const [usuarioSelecionado, setUsuarioSelecionado] = useState({});
  const [ListaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    fetch(urlBase2)
      .then((resposta) => resposta.json())
      .then((dados) => {
        setListaUsuarios(dados);
      });
  }, []);

  // Gerenciamento de Campos Selecionados

  const [campoSelecionado, setCampoSelecionado] = useState({});
  const [camposSelecionados, setCamposSelecionados] = useState([]);

  // Adicionando Campos ao Agendamento

  const handleSalvarCampo = () => {
    if (
      campoSelecionado.id &&
      campoSelecionado.descricao &&
      campoSelecionado.corReferencial
    ) {
      setCamposSelecionados([...camposSelecionados, campoSelecionado]);
      setCampoSelecionado({});
    }
  };

  // Removendo Campos do Agendamento

  const handleRemoverCampo = (index) => {
    const novosCamposSelecionados = [...camposSelecionados];
    novosCamposSelecionados.splice(index, 1);
    setCamposSelecionados(novosCamposSelecionados);
  };

  return (
    <Form
      noValidate
      validated={validado}
      onSubmit={manipularEnvio}
    >
      <Container className="mt-4 mb-4 d-flex justify-content-center">
        <h1>Agendamento de Campos no Sistema</h1>
      </Container>
      <Row>
        {modoFormulario === "PUT" && (
          <div className="alert alert-warning">
            Você pode editar a DATA e o HORÁRIO do Agendamento. <br />
            <br />
            Não se esqueça de informar o Usuário correspondente ao seu protocolo de
            Agendamento (ID).
          </div>
        )}

        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Seleção de Usuário:</Form.Label>
            <BarraBusca
              placeHolder={"Pesquise por Usuário"}
              dados={ListaUsuarios}
              campoChave={"cpf"}
              campoBusca={"nome"}
              funcaoSelecao={setUsuarioSelecionado}
              valor={""}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o Usuário!
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Protocolo:</Form.Label>
            <Form.Control
              disabled
              type="text"
              placeholder="O Protocolo do Agendamento é gerado automaticamente."
              value={agendamento.id}
              id="id"
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Label>Selecione um ou mais Campos:</Form.Label>
          <CaixaSelecao
            disabled={modoFormulario === "PUT"}
            urlBase3={urlBase3}
            campoChave="id"
            campoSelecao="corReferencial"
            funccaoSelecao={setCampoSelecionado}
          />
          <Button
            disabled={modoFormulario === "PUT" || campoSelecionado.descricao === "Em manutenção" || campoSelecionado.descricao === "Sem manutenção"}
            onClick={handleSalvarCampo}
          >
            Adicionar
          </Button>

          <Form.Control.Feedback type="invalid">
            Por favor, informe um Campo!
          </Form.Control.Feedback>
        </Col>

        <Row>
          <Col>
            <Form.Label>Número do Campo:</Form.Label>
            <Form.Control
              disabled
              type="text"
              placeholder="Número do Campo Selecionado"
              value={campoSelecionado.id}
              id="id"
            ></Form.Control>
          </Col>
          <Col>
            <Form.Label>Situação:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Situação do campo selecionado"
              value={campoSelecionado.descricao}
              id="descricao"
              style={{
                backgroundColor:
                  campoSelecionado.descricao === "Em manutenção" || campoSelecionado.descricao === "Sem manutenção" ? "red" : "",
                  color: campoSelecionado.descricao === "Em manutenção" || campoSelecionado.descricao === "Sem manutenção" ? "white" : "black",
              }}
              disabled
            />
          </Col>
          <Col>
            <Form.Label>Cor de Referência:</Form.Label>
            <Form.Control
              disabled
              type="text"
              placeholder="Cor Referência do Campo Selecionado"
              value={campoSelecionado.corReferencial}
              id="corReferencial"
            ></Form.Control>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Informe uma Data:</Form.Label>
              <Form.Control
                type="date"
                value={agendamento.data}
                id="data"
                onChange={manipularInput}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira uma data!
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Row>

      <Row>
        <Col>
          <Form.Label>Selecione um Horário:</Form.Label>
          <Form.Select
            aria-label="Selecione a Categoria"
            value={agendamento.horario}
            id="horario"
            onChange={manipularInput}
          >
            <option value="Erro. Seleção não efetivada!">Selecione um Horário...</option>
            <option value="8 AM">8 Horas</option>
            <option value="10 AM">10 Horas</option>
            <option value="14 PM">14 Horas</option>
            <option value="16 PM">16 Horas</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Por favor, informe um Horário!
          </Form.Control.Feedback>
        </Col>

        <Row className="mt-4">
          <Col>
            <Table
              disabled={modoFormulario === "PUT"}
              striped
              bordered
              hover
            >
              <thead>
                <tr>
                  <th>ID Campo</th>
                  <th>Situação</th>
                  <th>Cor Referência</th>
                  <th>Aperte para Remover</th>
                </tr>
              </thead>
              <tbody>
                {camposSelecionados.map((campo, index) => (
                  <tr key={index}>
                    <td>{campo.id}</td>
                    <td>{campo.descricao}</td>
                    <td>{campo.corReferencial}</td>
                    <td>
                      <Button
                        disabled={modoFormulario === "PUT"}
                        onClick={() => handleRemoverCampo(index)}
                      >
                        Remover Opção
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <div>
            <br />
          </div>
        </Row>

        <Row>
          <Col md={5}>
            <Button type="submit">Enviar informações</Button>
            <div>
              <br />
            </div>
            <Button
              type="button"
              onClick={() => {
                props.mostraTabela(true);
              }}
            >
              Voltar
            </Button>
          </Col>
        </Row>
      </Row>
    </Form>
  );
}

export default FormAgendamento;
