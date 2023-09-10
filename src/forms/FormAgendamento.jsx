import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { urlBase, urlBase2 } from "../utilitarios/definicoes";
import BarraBusca from "./BarraBusca.js";

function FormAgendamento(props) {
  const [validado, setValidado] = useState(false);
  const [agendamento, setAgendamento] = useState(props.agendamento);

  function manipularInput(e) {
    const elementoForm = e.currentTarget;
    const codigo = elementoForm.codigo;
    const valor = elementoForm.value;
    setAgendamento({ ...agendamento, [codigo]: valor });
  }

  function manipularEnvio(evento) {
    const form = evento.currentTarget;

    if (form.checkValidity()) {
      const usuario = {
        cpf: usuarioSelecionado.cpf,
        nome: usuarioSelecionado.nome,
      };

      const dadosParaEnvio = {
        campo: agendamento.campo,
        data: agendamento.data,
        horario: agendamento.horario,
        usuario: usuario,
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
        dadosParaEnvio.codigo = agendamento.codigo;
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

  const [usuarioSelecionado, setUsuarioSelecionado] = useState({});
  const [ListaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    fetch(urlBase2)
      .then((resposta) => resposta.json())
      .then((dados) => {
        setListaUsuarios(dados);
      });
  }, []);

  return (
    <Form
      noValidate
      validated={validado}
      onSubmit={manipularEnvio}
    >
      <Container className="mt-4 mb-4 d-flex justify-content-center">
        <h1>Agendar Espaço no Sistema</h1>
      </Container>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Usuário:</Form.Label>
            <BarraBusca
              placeHolder={"Informe um Usuário"}
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
            <Form.Label>Código:</Form.Label>
            <Form.Control
              disabled
              type="number"
              placeholder="O código será gerado automaticamente."
              value={agendamento.codigo}
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Label>Selecione um Campo:</Form.Label>
          <Form.Select
            aria-label="Selecione um Campo"
            value={agendamento.campo}
            id="campo"
            onChange={manipularInput}
          >
            <option value="Erro! Seleção não efetivada!">Selecione um Campo...</option>
            <option value="Violeta">Violeta</option>
            <option value="Amarelo">Amarelo</option>
            <option value="Roxo">Roxo</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Por favor, informe um Campo!
          </Form.Control.Feedback>
        </Col>

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
            <option value="16 Horas">16 Horas</option>
            <option value="17 Horas">17 Horas</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Por favor, informe um Horário!
          </Form.Control.Feedback>
        </Col>

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
