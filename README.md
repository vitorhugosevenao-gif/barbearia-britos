# 💈 Barbearia Britos - Website Oficial

Este é o repositório do site institucional e de conversão da **Barbearia Britos**. O projeto foi desenvolvido para oferecer uma experiência premium aos clientes, destacando os planos de assinatura, serviços, galeria de cortes e facilitando o agendamento via WhatsApp.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web nativas (Vanilla), garantindo alta performance, leveza e facilidade de manutenção, sem a dependência de frameworks pesados.

*   **HTML5:** Estrutura semântica e acessível.
*   **CSS3:** Estilização moderna, layout responsivo (Flexbox/Grid), variáveis CSS e animações nativas (Keyframes).
*   **JavaScript (Vanilla):** Utilizado para o carrossel infinito de parceiros, animações de revelação no scroll e integração com a biblioteca 3D.
*   **Three.js (via CDN):** Renderização dos elementos 3D (emblema e potes de produto) na página inicial.
*   **FormSubmit:** Integração gratuita para o envio de e-mails através do formulário de SAC sem a necessidade de um backend próprio.
*   **Google Fonts:** Tipografia customizada (Big Shoulders Display e Montserrat).

## 📂 Estrutura de Arquivos

A organização do projeto foi pensada para manter o código limpo e os arquivos fáceis de encontrar:

```text
/
├── index.html               # Página principal (Hero, Planos, Serviços, Galeria, etc.)
├── privacidade.html         # Página de Política de Privacidade (LGPD)
├── termos.html              # Página de Termos de Uso
├── acessibilidade.html      # Página de diretrizes de acessibilidade
├── sac.html                 # Página de Atendimento ao Cliente (com formulário)
├── README.md                # Documentação do projeto
└── assets/
    ├── css/
    │   └── style.css        # Todo o estilo do site (variáveis, componentes, responsividade)
    ├── js/
    │   └── hero-3d.js       # Script responsável pela renderização do Three.js
    └── img/
        ├── galeria/         # Fotos dos cortes (cabelo-1.jpg, etc.)
        ├── parceiros/       # Logos das marcas (coca-cola.webp, etc.)
        ├── emblema-branco.png
        ├── fachada.jpg
        ├── logo-branco.png
        └── barbeiro-atendimento.jpg
