import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import '../styles/PrivacyPolicy.css';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-policy-page">
      <div className="privacy-policy-background" />
      <div className="privacy-policy-overlay">
        <div className="privacy-policy-container">
          <Card className="privacy-policy-card">
            <div className="privacy-policy-header">
              <div className="privacy-policy-logo">
                <img
                  src="../../public/logos/web-app-manifest-192x192.png"
                  alt="HERES Logo"
                  className="app-logo"
                />
              </div>
              <h1 className="privacy-policy-title">Política de Privacidad y Protección de Datos</h1>
              <p className="privacy-policy-subtitle">Centro Juvenil Juveliber - Sistema HERES</p>
              <p className="privacy-policy-date">Última actualización: 3 de octubre de 2025</p>
            </div>

            <div className="privacy-policy-content">
              <section className="policy-section">
                <h2>1. Responsable del Tratamiento de Datos</h2>
                <div className="policy-info-box">
                  <p>
                    <strong>Responsable:</strong> Centro Juvenil Juveliber
                  </p>
                  <p>
                    <strong>Dirección:</strong> Calle Reina Victoria, 27, 28982, Parla (Madrid)
                  </p>
                  <p>
                    <strong>CIF:</strong> G82265307
                  </p>
                  <p>
                    <strong>Email de contacto:</strong>{' '}
                    <a href="mailto:juveliber@valdoco.org">juveliber@valdoco.org</a>
                  </p>
                  <p>
                    <strong>Ficheros registrados:</strong> SOCIOS y ACTIVIDADES (inscritos en el
                    Registro General de Protección de Datos)
                  </p>
                  <p>
                    El Centro mantiene un Registro de Actividades de Tratamiento conforme al Art. 30
                    del RGPD, disponible para consulta previa solicitud.
                  </p>
                </div>
              </section>

              <section className="policy-section">
                <h2>2. Datos Personales que Recopilamos</h2>
                <p>
                  En el Centro Juvenil Juveliber recopilamos los siguientes datos personales
                  necesarios para la gestión de las actividades:
                </p>
                <ul>
                  <li>
                    <strong>Datos de identificación:</strong> Nombre, apellidos y nombre de usuario
                  </li>
                  <li>
                    <strong>Datos de contacto:</strong> Correo electrónico y teléfono
                  </li>
                  <li>
                    <strong>Datos demográficos:</strong> Fecha de nacimiento
                  </li>
                  <li>
                    <strong>Datos de participación:</strong> Grupo y sección asignada
                  </li>
                  <li>
                    <strong>Imágenes y voz:</strong> Fotografías y grabaciones de audio/vídeo
                    realizadas durante actividades, eventos y actos del centro
                  </li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>3. Finalidad del Tratamiento</h2>
                <p>
                  Los datos personales recogidos serán incluidos en los ficheros denominados{' '}
                  <strong>SOCIOS</strong> y <strong>ACTIVIDADES</strong> y serán tratados con las
                  siguientes finalidades:
                </p>
                <ul>
                  <li>Control y gestión administrativa de los socios del centro juvenil</li>
                  <li>
                    Presentación, organización y gestión de las actividades programadas (talleres,
                    grupos formativos, juegos, oraciones, eventos)
                  </li>
                  <li>
                    Comunicación de eventos, convocatorias y avisos relacionados con el centro
                    juvenil
                  </li>
                  <li>Elaboración de listados de participantes y control de asistencia</li>
                  <li>
                    Gestión de juegos, dinámicas y actividades lúdicas donde el nombre de usuario
                    será visible
                  </li>
                  <li>Cumplimiento de obligaciones legales y normativas aplicables</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>4. Base Legal del Tratamiento</h2>
                <p>La base legal para el tratamiento de sus datos personales es:</p>
                <ul>
                  <li>
                    <strong>Consentimiento del interesado:</strong> Al registrarse y aceptar esta
                    política, usted consiente expresamente el tratamiento de sus datos personales
                    conforme a lo previsto en el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica
                    3/2018 de Protección de Datos Personales y garantía de los derechos digitales
                    (LOPDGDD)
                  </li>
                  <li>
                    <strong>Ejecución de un contrato:</strong> Para la prestación de servicios
                    educativos, formativos y pastorales del centro juvenil
                  </li>
                  <li>
                    <strong>Interés legítimo:</strong> Gestión administrativa y organizativa de las
                    actividades del centro
                  </li>
                </ul>
              </section>

              <section className="policy-section highlight-section">
                <h2>5. Tratamiento de Datos de Menores de Edad</h2>
                <div className="policy-alert">
                  <i className="pi pi-exclamation-triangle"></i>
                  <div>
                    <p>
                      <strong>IMPORTANTE:</strong> Conforme a la Ley Orgánica 3/2018 de Protección
                      de Datos Personales y garantía de los derechos digitales (LOPDGDD), el
                      tratamiento de datos de{' '}
                      <strong>
                        menores de 14 años requiere el consentimiento de los padres, madres o
                        tutores legales
                      </strong>
                      .
                    </p>
                    <p>
                      Los padres, madres o tutores legales deben autorizar expresamente el registro
                      y participación de menores de 14 años en las actividades del centro juvenil
                      mediante la cumplimentación del formulario correspondiente.
                    </p>
                    <p>
                      Para menores entre 14 y 18 años, pueden prestar su consentimiento por sí
                      mismos, aunque se recomienda la supervisión y conocimiento parental.
                    </p>
                    <p>
                      Conforme al artículo 4.3 de la Ley Orgánica 1/1996 de Protección Jurídica del
                      Menor, la difusión de imágenes de menores no supondrá una intromisión
                      ilegítima a su intimidad o reputación ni será contraria a sus intereses.
                    </p>
                  </div>
                </div>
              </section>

              <section className="policy-section">
                <h2>6. Tratamiento de Imágenes y Voz</h2>
                <p>
                  El Centro Juvenil Juveliber informa que las{' '}
                  <strong>imágenes, fotografías y grabaciones de audio/vídeo</strong> del socio o
                  participante recogidas en los diferentes actos, eventos, actividades y
                  celebraciones del centro podrán ser objeto de:
                </p>
                <ul>
                  <li>
                    Publicación en las páginas web oficiales del centro:{' '}
                    <a href="https://juveliber.es" target="_blank" rel="noopener noreferrer">
                      juveliber.es
                    </a>{' '}
                    y{' '}
                    <a href="https://salesianosparla.es" target="_blank" rel="noopener noreferrer">
                      salesianosparla.es
                    </a>
                  </li>
                  <li>Difusión en redes sociales del centro juvenil (Instagram, Facebook, etc.)</li>
                  <li>Inclusión en reportajes, anuarios, boletines y/o revistas del centro</li>
                  <li>
                    Publicación en libros conmemorativos y materiales promocionales del centro
                  </li>
                  <li>Elaboración de memorias de actividades</li>
                </ul>
                <p>
                  <strong>
                    Siempre que dicha difusión no suponga una intromisión ilegítima a la intimidad o
                    reputación del menor o sea contraria a sus intereses
                  </strong>
                  , conforme a lo establecido en el artículo 4.3 de la Ley Orgánica 1/1996 de
                  protección jurídica del menor.
                </p>

                <div className="policy-info-box">
                  <p>
                    <strong>DERECHO DE OPOSICIÓN A LA PUBLICACIÓN DE IMÁGENES:</strong>
                  </p>
                  <p>
                    Si se opone a la publicación de las imágenes en los términos previstos, deberá
                    comunicarlo expresamente al centro. En caso contrario, se entenderá que presta
                    su consentimiento para la publicación y difusión de imágenes en los medios
                    anteriormente indicados.
                  </p>
                  <p>
                    Este derecho puede ejercitarse en cualquier momento contactando con el centro a
                    través de los medios indicados en esta política.
                  </p>
                </div>
              </section>

              <section className="policy-section">
                <h2>7. Destinatarios de los Datos</h2>
                <p>
                  Sus datos personales no serán cedidos a terceros, salvo en los siguientes casos:
                </p>
                <ul>
                  <li>Cumplimiento de obligaciones legales</li>
                  <li>
                    Autorización expresa del titular de los datos o de sus representantes legales
                  </li>
                  <li>
                    Proveedores de servicios técnicos necesarios para el funcionamiento del sistema
                    HERES (alojamiento web, servicios en la nube), que actuarán como encargados del
                    tratamiento bajo contrato y con las debidas garantías
                  </li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>8. Conservación de los Datos</h2>
                <p>
                  Los datos personales se conservarán durante el tiempo necesario para cumplir con
                  las finalidades para las que fueron recogidos:
                </p>
                <ul>
                  <li>
                    Mientras dure la participación activa como socio o participante en las
                    actividades del centro juvenil
                  </li>
                  <li>
                    Durante los plazos legalmente establecidos para el cumplimiento de obligaciones
                    legales, contables y fiscales
                  </li>
                  <li>
                    Hasta que el titular de los datos o sus representantes legales soliciten su
                    supresión, siempre que no exista obligación legal de conservarlos
                  </li>
                  <li>
                    Las imágenes publicadas se mantendrán mientras no se solicite su retirada por el
                    interesado o sus representantes legales
                  </li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>9. Derechos del Interesado (ARCO-POL)</h2>
                <p>
                  Como titular de los datos personales, usted o sus representantes legales tienen
                  derecho a:
                </p>
                <ul>
                  <li>
                    <strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted y
                    obtener copia de los mismos
                  </li>
                  <li>
                    <strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o
                    incompletos
                  </li>
                  <li>
                    <strong>Cancelación/Supresión:</strong> Solicitar la eliminación de sus datos
                    personales ("derecho al olvido")
                  </li>
                  <li>
                    <strong>Oposición:</strong> Oponerse al tratamiento de sus datos en determinadas
                    circunstancias, incluyendo la oposición a la publicación de imágenes
                  </li>
                  <li>
                    <strong>Limitación:</strong> Solicitar la limitación del tratamiento de sus
                    datos
                  </li>
                  <li>
                    <strong>Portabilidad:</strong> Recibir sus datos en formato estructurado, de uso
                    común y legible por máquina
                  </li>
                  <li>
                    <strong>Retirada del consentimiento:</strong> Retirar el consentimiento en
                    cualquier momento sin que ello afecte a la licitud del tratamiento previo
                  </li>
                </ul>

                <div className="policy-info-box">
                  <p>
                    <strong>Cómo ejercer sus derechos:</strong>
                  </p>
                  <p>Puede ejercitar sus derechos dirigiéndose por escrito a:</p>
                  <p>
                    <strong>Centro Juvenil Juveliber</strong>
                  </p>
                  <p>Calle Reina Victoria, 27, 28982, Parla (Madrid)</p>
                  <p>
                    O a través de correo electrónico a:{' '}
                    <a href="mailto:juveliber@valdoco.org">juveliber@valdoco.org</a>
                  </p>
                  <p>
                    Indicando en el asunto: <strong>"PROTECCIÓN DE DATOS"</strong>
                  </p>
                  <p>
                    Adjuntando prueba válida en derecho (fotocopia del D.N.I., N.I.E. o pasaporte)
                  </p>
                  <p>
                    Responderemos a su solicitud en el <strong>plazo máximo de 1 mes</strong> desde
                    la recepción, pudiendo prorrogarse 2 meses más en casos complejos, informándole
                    de la prórroga.
                  </p>
                </div>
              </section>

              <section className="policy-section">
                <h2>10. Reclamaciones ante la Autoridad de Control</h2>
                <p>
                  Si considera que el tratamiento de sus datos personales no se ajusta a la
                  normativa vigente, tiene derecho a presentar una reclamación ante la{' '}
                  <strong>Agencia Española de Protección de Datos (AEPD)</strong>:
                </p>
                <div className="policy-info-box">
                  <p>
                    <strong>Agencia Española de Protección de Datos</strong>
                  </p>
                  <p>C/ Jorge Juan, 6</p>
                  <p>28001 - Madrid</p>
                  <p>Teléfono: 901 100 099 / 912 663 517</p>
                  <p>
                    Web:{' '}
                    <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
                      www.aepd.es
                    </a>
                  </p>
                  <p>
                    Sede electrónica:{' '}
                    <a href="https://sedeagpd.gob.es" target="_blank" rel="noopener noreferrer">
                      sedeagpd.gob.es
                    </a>
                  </p>
                </div>
              </section>

              <section className="policy-section">
                <h2>11. Seguridad de los Datos</h2>
                <p>
                  El Centro Juvenil Juveliber ha adoptado las medidas técnicas y organizativas
                  necesarias para garantizar la seguridad de los datos personales y evitar su
                  alteración, pérdida, tratamiento o acceso no autorizado, incluyendo:
                </p>
                <ul>
                  <li>Cifrado de datos en tránsito mediante protocolo HTTPS/SSL</li>
                  <li>Control de acceso mediante autenticación de usuarios</li>
                  <li>Registro de eventos y trazabilidad de accesos</li>
                  <li>Copias de seguridad periódicas y automáticas</li>
                  <li>Formación del personal en protección de datos y confidencialidad</li>
                  <li>Contratos de encargado de tratamiento con proveedores tecnológicos</li>
                  <li>
                    Protocolo de notificación de brechas de seguridad a la AEPD en menos de 72 horas
                    conforme al Art. 33 del RGPD
                  </li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>12. Modificaciones de la Política de Privacidad</h2>
                <p>
                  Nos reservamos el derecho a modificar esta Política de Privacidad para adaptarla a
                  cambios legislativos, jurisprudenciales, organizativos o en nuestras prácticas de
                  tratamiento de datos.
                </p>
                <p>
                  Cualquier modificación relevante será comunicada con antelación suficiente a
                  través de:
                </p>
                <ul>
                  <li>Notificación en la plataforma HERES</li>
                  <li>Correo electrónico a la dirección registrada</li>
                  <li>Aviso visible en la página web del centro</li>
                </ul>
                <p>
                  Se recomienda revisar periódicamente esta política para estar informado de
                  cualquier cambio.
                </p>
              </section>

              <section className="policy-section">
                <h2>13. Consentimiento y Aceptación</h2>
                <p>
                  Con la cumplimentación del formulario de registro, el afectado o sus
                  representantes legales quedan informados y consienten que:
                </p>
                <ul>
                  <li>
                    Los datos recogidos serán incluidos en los ficheros <strong>SOCIOS</strong> y{' '}
                    <strong>ACTIVIDADES</strong>
                  </li>
                  <li>
                    Los datos serán tratados conforme a las finalidades descritas en esta política
                  </li>
                  <li>
                    Las imágenes podrán ser publicadas según lo establecido en el apartado 6, salvo
                    oposición expresa
                  </li>
                  <li>Han sido informados de sus derechos y de cómo ejercitarlos</li>
                  <li>Han leído y aceptado la presente Política de Privacidad</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>14. Contacto y Delegado de Protección de Datos</h2>
                <p>
                  Para cualquier duda, consulta o ejercicio de derechos relacionados con la
                  protección de datos, puede contactarnos en:
                </p>
                <div className="policy-info-box">
                  <p>
                    <strong>Centro Juvenil Juveliber</strong>
                  </p>
                  <p>
                    <strong>Dirección postal:</strong> Calle Reina Victoria, 27, 28982, Parla
                    (Madrid)
                  </p>
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:juveliber@valdoco.org">juveliber@valdoco.org</a>
                  </p>
                  <p>
                    <strong>Email alternativo:</strong>{' '}
                    <a href="mailto:emmanuel.lokossou@juveliber.es">
                      emmanuel.lokossou@juveliber.es
                    </a>
                  </p>
                  <p>
                    <strong>Asunto:</strong> PROTECCIÓN DE DATOS
                  </p>
                </div>
              </section>

              <section className="policy-section">
                <h2>15. Normativa Aplicable</h2>
                <p>
                  Esta Política de Privacidad se rige por la normativa española y europea vigente en
                  materia de protección de datos:
                </p>
                <ul>
                  <li>
                    <strong>Reglamento (UE) 2016/679</strong> del Parlamento Europeo y del Consejo,
                    de 27 de abril de 2016, relativo a la protección de las personas físicas en lo
                    que respecta al tratamiento de datos personales y a la libre circulación de
                    estos datos (RGPD)
                  </li>
                  <li>
                    <strong>Ley Orgánica 3/2018</strong>, de 5 de diciembre, de Protección de Datos
                    Personales y garantía de los derechos digitales (LOPDGDD)
                  </li>
                  <li>
                    <strong>Ley Orgánica 1/1996</strong>, de 15 de enero, de Protección Jurídica del
                    Menor
                  </li>
                </ul>
                <p className="policy-note">
                  Esta política de privacidad sustituye y actualiza cualquier versión anterior
                  basada en normativa derogada (LO 15/1999 y RD 1720/2007).
                </p>
              </section>
            </div>

            <div className="privacy-policy-footer">
              <Button
                label="Volver al Registro"
                icon="pi pi-arrow-left"
                className="back-button"
                onClick={() => navigate('/qr/register-member')}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
