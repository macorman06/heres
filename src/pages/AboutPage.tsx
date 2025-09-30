import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export const AboutPage: React.FC = () => {
  return (
    <div className="about-letter-page">
      <div className="letter-container">
        <Card className="letter-card">
          {/* Header simple */}
          <div className="letter-header">
            <img
              src="/logos/web-app-manifest-192x192.png"
              alt="HERES Logo"
              className="letter-logo"
            />
            <div className="letter-date">Septiembre 2025</div>
          </div>

          {/* Contenido de la carta */}
          <div className="letter-content">
            <h1 className="letter-greeting">Hola,</h1>

            <p>
              Soy <strong>Marcos</strong>, el autor y desarrollador de esta herramienta. Quiero compartir
              contigo, de corazón, por qué nació esta herramienta y qué sueño con ella para nuestra
              comunidad salesiana.
            </p>

            <h3>¿Por qué nace HERES?</h3>

            <p>
              Durante mucho tiempo, he observado cómo dedicamos <em>demasiadas horas</em> a tareas
              que deberían ser simples: organizar actividades, comunicar responsabilidades a los
              animadores, gestionar materiales dispersos entre WhatsApp, Excel y Google Drive...
            </p>

            <p>
              Además, no existía forma de compartir juegos, talleres y actividades entre distintos
              centros juveniles salesianos. Cada vez que queríamos preparar algo nuevo, partíamos
              casi de cero, sin poder aprovechar las experiencias y recursos de otros grupos.
            </p>

            <div className="letter-quote">
              <p>
                "¿Y si pudiéramos crear algo que nos una, que simplifique lo complejo y nos permita
                dedicar más tiempo a lo que verdaderamente importa: acompañar a los jóvenes?"
              </p>
            </div>

            <p>
              Esa pregunta fue el inicio de HERES. Quise crear una aplicación <strong>fuerte y
              robusta</strong>, con una gran cantidad de material, que hiciera más sencillo el
              reparto de tareas y el compartir recursos entre todos nosotros.
            </p>

            <h3>¿Qué es HERES?</h3>

            <p>
              HERES (Herramienta de Recursos Salesianos) es más que una aplicación web. Es una
              plataforma pensada para resolver problemas reales que enfrentamos día a día en
              nuestros centros juveniles:
            </p>

            <ul className="letter-features-list">
              <li>
                <strong>Gestión eficiente:</strong> Sin perder tiempo en organizar tareas o buscar
                información dispersa en múltiples plataformas.
              </li>
              <li>
                <strong>Comunicación clara:</strong> Envío rápido de tareas y responsabilidades a
                animadores y coordinadores.
              </li>
              <li>
                <strong>Recursos compartidos:</strong> Una base de datos completa de juegos, talleres
                y actividades originales que todos podemos usar.
              </li>
              <li>
                <strong>Colaboración entre centros:</strong> Preparar campamentos, pascuas y encuentros
                junto con encargados de otros centros juveniles.
              </li>
            </ul>

            <p>
              Trabajo como programador y siempre me ha gustado crear cosas que hagan los procesos
              de trabajo más eficientes. Cuando vi que no nos organizábamos bien, que tardábamos
              en comunicarnos y desconocíamos el estado de muchas actividades, supe que tenía que
              hacer algo.
            </p>

            <div className="letter-personal-note">
              <p>
                <strong>Mi convicción:</strong> Es cierto que no quitamos tiempo de estar con los
                chicos por preparar estas actividades, pero sin duda sería más sencillo y el
                contenido sería mejor si todos tuviéramos mayor cantidad de recursos y una mejor
                organización, sin tanto esfuerzo de directores y coordinadores.
              </p>
            </div>

            <h3>¿Qué quiero que sientas al usar HERES?</h3>

            <p>
              Mi deseo es que al usar esta aplicación experimentes <strong>comodidad y
              sencillez</strong>. Que tengas la sensación de que, con todo el material disponible,
              es muy fácil ofrecer contenido de calidad a los jóvenes sin repetirte, sin agotarte,
              sin quedarte sin ideas.
            </p>

            <p>
              Quiero que HERES sea ese recurso al que acudes con confianza, sabiendo que ahí
              encontrarás lo que necesitas para tu próximo taller, tu siguiente juego, tu nueva
              actividad.
            </p>

            <h3>¿Dónde estamos ahora?</h3>

            <p>
              La aplicación está en sus <strong>primeros pasos</strong>, con funcionalidades muy
              básicas. Ahora mismo puedes gestionar usuarios y ver un dashboard con información
              esencial. Pero esto es solo el comienzo.
            </p>

            <p>
              Mi visión para HERES es ambiciosa:
            </p>

            <ul className="letter-vision-list">
              <li>Gestión completa de usuarios con alta seguridad de datos importantes</li>
              <li>Compartir tareas entre centros juveniles, preparada para campamentos o a nivel inspectorial</li>
              <li>Portal para preparar pascuas, encuentros y otras actividades conjuntas</li>
              <li>Varios encargados de distintos centros trabajando juntos en juegos, grupos y talleres</li>
              <li>Red social salesiana donde comunicarnos entre personas de diferentes grupos</li>
              <li>Herramienta integral de organización y reparto de responsabilidades</li>
            </ul>

            <p>
              Sueño con que HERES se convierta en la <strong>herramienta de referencia</strong> de la Pastoral Juvenil Salesiana, esa
              plataforma a la que todos acudimos con confianza y que nos une en nuestra misión educativa.
            </p>

            <h3>¿Qué necesito de ti?</h3>

            <p>
              Me encantaría que <strong>formes parte</strong> de este proyecto. Que me escribas,
              que me envíes información, que me des ideas, que te involucres.
            </p>

            <div className="letter-quote">
              <p>
                "Jóvenes, muévanse, hagan lío, no se queden quietos. Sean protagonistas,
                no espectadores de la vida."
                <br />
                <cite>— Papa Francisco</cite>
              </p>
            </div>

            <p>
              Así es como quiero que veas HERES: como una invitación a hacer lío positivo,
              a no quedarte quieto esperando que otros resuelvan los desafíos de la pastoral
              juvenil. Que sepas que esto llegará lejos, y que lo único que busca esta
              aplicación es el beneficio de todos, y sobre todo, <em>de los jóvenes</em>.
            </p>

            <div className="letter-closing">
              <p>
                Gracias por tomarte el tiempo de leer esta carta. Gracias por dedicar tu vida
                a los jóvenes. Y gracias por considerar que HERES pueda ser una pequeña ayuda
                en tu gran misión.
              </p>

              <p style={{ marginTop: '2rem' }}>
                Un fuerte abrazo, Marcos.
              </p>

            </div>

            <div className="letter-ps">
              <p>
                <strong>PD:</strong> Si quieres contactarme directamente, mi email es{' '}
                <a href="mailto:marcos.corpas@juveliber.es">marcos.corpas@juveliber.es</a>.
                Me encanta escuchar historias de otros centros juveniles y aprender de vuestras
                experiencias.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
