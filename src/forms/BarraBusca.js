import { useRef, useState, useEffect } from "react";
import { Form, Container } from "react-bootstrap";
import "./barraBusca.css";

function BarraBusca({
  placeHolder,
  dados,
  campoChave,
  campoBusca,
  funcaoSelecao,
  valor,
}) {
  const inputBusca = useRef();

  const [termoBusca, setTermoBusca] = useState(valor ? valor : "");
  const [dadosLista, setDadosLista] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(false);

  useEffect(() => {
    filtrarResultado();
  }, [termoBusca]);

  function filtrarResultado() {
    const dadosFiltrados = dados.filter((item) =>
      item[campoBusca].toLowerCase().includes(termoBusca.toLowerCase())
    );

    setDadosLista(dadosFiltrados);
  }

  return (
    <Container>
      <div className="barra">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
        <Form.Control
          className="input"
          type="text"
          ref={inputBusca}
          placeholder={placeHolder}
          value={termoBusca}
          required
          onChange={(e) => {
            setTermoBusca(e.target.value.toLowerCase());
            filtrarResultado();
            if (!itemSelecionado) {
              e.target.setAttribute("aria-invaid", true);
              e.target.setCustomValidity("erro");
            } else {
              e.target.removeAttribute("aria-invalid");
              e.target.setCustomValidity("");
            }
          }}
        ></Form.Control>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-x-circle"
          viewBox="0 0 16 16"
          onClick={() => {
            setTermoBusca("");
            filtrarResultado();
            setItemSelecionado(false);
            funcaoSelecao({});
            inputBusca.current.setAttribute("aria-invalid", true);
            inputBusca.current.setCustomValidity("erro");
          }}
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>
      </div>
      <div className="resultado">
        <ul data-resultado>
          {dadosLista.map((item) => {
            return (
              <li
                key={item[campoChave]}
                onClick={() => {
                  setTermoBusca(item[campoBusca]);
                  setItemSelecionado(true);
                  funcaoSelecao(item);
                  inputBusca.current.setCustomValidity("");
                  let componenteResultado = document.querySelector("[data-resultado]");
                  componenteResultado.style.display = "none";
                }}
              >
                {item[campoChave] + " - " + item[campoBusca]}
              </li>
            );
          })}
        </ul>
      </div>
    </Container>
  );
}

export default BarraBusca;
