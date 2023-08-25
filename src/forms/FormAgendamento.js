import { useState } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { urlBase } from "../utilitarios/definicoes";

function FormAgendamento(props) {
  const [validado, setValidado] = useState(false);
  const [agendamento, setAgendamento] = useState(props.agendamento);

  function manipularInput(e) {
    const elementoForm = e.currentTarget;
    const id = elementoForm.id;
    const valor = elementoForm.value;
    setAgendamento({ ...agendamento, [id]: valor });
  }

  function manipularEnvio(evento) {
    const form = evento.currentTarget;
    if (form.checkValidity()) {
      if (!props.modoEdicao) {
        fetch(urlBase, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agendamento),
        }).then((resposta) => {
          window.alert("Agendamento cadastrado com sucesso!!!");
          window.location.reload();
          return resposta.json();
        });
      } else {
        fetch(urlBase, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agendamento),
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
            <Form.Label>Id:</Form.Label>
            <Form.Control
              disabled
              type="number"
              placeholder="O Id será gerado automaticamente."
              value={agendamento.id}
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
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Usuário:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Será recuperado via Barra de Busca."
              value={agendamento.usuario}
              id="usuario"
              onChange={manipularInput}
              required
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o Usuário!
            </Form.Control.Feedback>
          </Form.Group>
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
