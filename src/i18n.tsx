import React, { createContext, useContext, useState } from "react";

export type Locale = "pt-BR" | "es";

export type TranslationItem = {
  "pt-BR"?: string;
  pt?: string;
  es?: string;
  [key: string]: string | undefined;
};

export const translations: Record<string, TranslationItem> = {
  "nav.dashboard": {
    "pt": "Dashboard",
    "es": "Panel"
  },
  "nav.territorios": {
    "pt": "Territórios",
    "es": "Territorios"
  },
  "nav.meus_territorios": {
    "pt": "Seus Territórios",
    "es": "Sus Territorios"
  },
  "nav.designacoes": {
    "pt": "Designações",
    "es": "Asignaciones"
  },
  "nav.enderecos": {
    "pt": "Endereços",
    "es": "Direcciones"
  },
  "nav.mapa_geral": {
    "pt": "Mapa Geral",
    "es": "Mapa General"
  },
  "nav.visitas": {
    "pt": "Visitas",
    "es": "Visitas"
  },
  "nav.publicadores": {
    "pt": "Publicadores",
    "es": "Publicadores"
  },
  "nav.dirigentes": {
    "pt": "Dirigentes",
    "es": "Dirigentes"
  },
  "nav.relatorios": {
    "pt": "Relatórios",
    "es": "Informes"
  },
  "nav.campanhas": {
    "pt": "Campanhas",
    "es": "Campañas"
  },
  "nav.configuracoes": {
    "pt": "Configurações",
    "es": "Configuración"
  },
  "nav.programar": {
    "pt": "Programar Designações",
    "es": "Programar Asignaciones"
  },
  "nav.programacao_campo": {
    "pt": "Programação de Campo",
    "es": "Programación de Campo"
  },
  "nav.sair": {
    "pt": "Sair",
    "es": "Salir"
  },
  "lang.label": {
    "pt": "Idioma",
    "es": "Idioma"
  },
  "common.cancelar": {
    "pt": "Cancelar",
    "es": "Cancelar"
  },
  "common.registrar": {
    "pt": "Registrar",
    "es": "Registrar"
  },
  "common.carregando": {
    "pt": "Carregando...",
    "es": "Cargando..."
  },
  "common.confirmar": {
    "pt": "Confirmar",
    "es": "Confirmar"
  },
  "common.endereco": {
    "pt": "Endereço",
    "es": "Dirección"
  },
  "common.territorio": {
    "pt": "Território",
    "es": "Territorio"
  },
  "common.observacoes": {
    "pt": "Observações",
    "es": "Observaciones"
  },
  "common.resultado": {
    "pt": "Resultado",
    "es": "Resultado"
  },
  "common.confirmado": {
    "pt": "Confirmado",
    "es": "Confirmado"
  },
  "common.convidado": {
    "pt": "Convidado",
    "es": "Invitado"
  },
  "visita.titulo": {
    "pt": "Registrar Visita",
    "es": "Registrar Visita"
  },
  "visita.encontrado_aviso": {
    "pt": "Essa opção só deve ser marcada caso tenha falado com algum estrangeiro no endereço.",
    "es": "Esta opción solo debe marcarse si habló con algún extranjero en la dirección."
  },
  "visita.nao_visitado_aviso": {
    "pt": "Essa opção só deve ser marcada caso você não tenha ido até o endereço.",
    "es": "Esta opción solo debe marcarse si no fue a la dirección."
  },
  "visita.quantos_moram": {
    "pt": "Quantos moram na casa",
    "es": "Cuántos viven en la casa"
  },
  "visita.numero_moradores": {
    "pt": "Número de moradores",
    "es": "Número de residentes"
  },
  "visita.pessoa_convidada": {
    "pt": "Pessoa convidada para a campanha",
    "es": "Persona invitada a la campaña"
  },
  "detalhe.titulo": {
    "pt": "Detalhes do Endereço",
    "es": "Detalles de la Dirección"
  },
  "detalhe.endereco_confirmado": {
    "pt": "Endereço confirmado",
    "es": "Dirección confirmada"
  },
  "detalhe.pendente_confirmacao": {
    "pt": "Pendente de confirmação",
    "es": "Pendiente de confirmación"
  },
  "detalhe.obs_admin": {
    "pt": "Observações do administrador",
    "es": "Observaciones del administrador"
  },
  "detalhe.historico": {
    "pt": "Histórico de visitas",
    "es": "Historial de visitas"
  },
  "detalhe.sem_visitas": {
    "pt": "Nenhuma visita registrada para este endereço.",
    "es": "Ninguna visita registrada para esta dirección."
  },
  "detalhe.sem_observacoes": {
    "pt": "Sem observações.",
    "es": "Sin observaciones."
  },
  "detalhe.ir_ate": {
    "pt": "Ir até o endereço",
    "es": "Ir a la dirección"
  },
  "detalhe.ultima_visitado": {
    "pt": "Última visita: Visitado",
    "es": "Última visita: Visitado"
  },
  "detalhe.ultima_nao_encontrado": {
    "pt": "Última visita: Não encontrado",
    "es": "Última visita: No encontrado"
  },
  "relatorio.visitas_titulo": {
    "pt": "Relatório de Visitas",
    "es": "Informe de Visitas"
  },
  "relatorio.periodo": {
    "pt": "Período",
    "es": "Período"
  },
  "relatorio.sem_visitas_periodo": {
    "pt": "Sem visitas no período.",
    "es": "Sin visitas en el período."
  },
  "relatorio.sem_dados_periodo": {
    "pt": "Nenhuma visita ou endereço encontrado para o período selecionado.",
    "es": "Ninguna visita o dirección encontrada para el período seleccionado."
  },
  "relatorio.endereços": {
    "pt": "endereços",
    "es": "direcciones"
  },
  "relatorio.visitas_no_periodo": {
    "pt": "visitas no período",
    "es": "visitas en el período"
  },
  "relatorio.pendentes": {
    "pt": "pendentes",
    "es": "pendientes"
  },
  "relatorio.obs_admin": {
    "pt": "Obs. admin",
    "es": "Obs. admin"
  },
  "relatorio.abrir_territorio": {
    "pt": "Abrir território",
    "es": "Abrir territorio"
  },
  "relatorio.sem_endereco_vinculado": {
    "pt": "Visitas sem endereço vinculado",
    "es": "Visitas sin dirección vinculada"
  },
  "designar.titulo": {
    "pt": "Designar Território",
    "es": "Asignar Territorio"
  },
  "designar.designar_para": {
    "pt": "Designar para",
    "es": "Asignar a"
  },
  "designar.dirigente": {
    "pt": "Dirigente",
    "es": "Dirigente"
  },
  "designar.publicador": {
    "pt": "Publicador",
    "es": "Publicador"
  },
  "designar.selecionar": {
    "pt": "Selecionar",
    "es": "Seleccionar"
  },
  "designar.nenhum": {
    "pt": "Nenhum disponível.",
    "es": "Ninguno disponible."
  },
  "designar.obs_opcional": {
    "pt": "Observações (opcional)",
    "es": "Observaciones (opcional)"
  },
  "designar.confirmar": {
    "pt": "Confirmar Designação",
    "es": "Confirmar Asignación"
  },
  "designar.aviso_enderecos": {
    "pt": "Atenção: alguns endereços deste território ainda não foram visitados.",
    "es": "Atención: algunas direcciones de este territorio aún no han sido visitadas."
  },
  "dash.bem_vindo": {
    "pt": "Bem-vindo,",
    "es": "Bienvenido,"
  },
  "dash.territorios_recentes": {
    "pt": "Territórios recentes",
    "es": "Territorios recientes"
  },
  "dash.ver_todos": {
    "pt": "Ver todos",
    "es": "Ver todos"
  },
  "dash.visitas_recentes": {
    "pt": "Visitas recentes",
    "es": "Visitas recientes"
  },
  "dash.sem_visitas": {
    "pt": "Sem visitas",
    "es": "Sin visitas"
  },
  "dash.sem_visitas_msg": {
    "pt": "Nenhuma visita registrada ainda.",
    "es": "Ninguna visita registrada aún."
  },
  "dash.territorios_designados": {
    "pt": "Territórios designados",
    "es": "Territorios asignados"
  },
  "dash.nenhum_designado": {
    "pt": "Nenhum designado",
    "es": "Ninguno asignado"
  },
  "dash.nenhum_designado_msg": {
    "pt": "Você ainda não designou um publicador para seus territórios.",
    "es": "Aún no ha asignado un publicador a sus territorios."
  },
  "dash.nao_designados": {
    "pt": "Territórios não designados",
    "es": "Territorios no asignados"
  },
  "dash.tudo_designado": {
    "pt": "Tudo designado",
    "es": "Todo asignado"
  },
  "dash.tudo_designado_msg": {
    "pt": "Todos os seus territórios já possuem publicador designado.",
    "es": "Todos sus territorios ya tienen publicador asignado."
  },
  "dash.aguardando": {
    "pt": "Aguardando",
    "es": "En espera"
  },
  "dash.meus_territorios": {
    "pt": "Meus territórios",
    "es": "Mis territorios"
  },
  "dash.sem_territorios": {
    "pt": "Sem territórios",
    "es": "Sin territorios"
  },
  "dash.sem_territorios_msg": {
    "pt": "Nenhum território designado a você no momento.",
    "es": "Ningún territorio asignado a usted en este momento."
  },
  "lbl.territorios": {
    "pt": "Territórios",
    "es": "Territorios"
  },
  "lbl.dirigentes": {
    "pt": "Dirigentes",
    "es": "Dirigentes"
  },
  "lbl.publicadores": {
    "pt": "Publicadores",
    "es": "Publicadores"
  },
  "lbl.enderecos": {
    "pt": "Endereços",
    "es": "Direcciones"
  },
  "lbl.designados": {
    "pt": "Designados",
    "es": "Asignados"
  },
  "lbl.nao_designados": {
    "pt": "Não designados",
    "es": "No asignados"
  },
  "lbl.dirigente_prefix": {
    "pt": "Dirigente:",
    "es": "Dirigente:"
  },
  "terr.subtitulo": {
    "pt": "Gerencie os territórios da congregação",
    "es": "Administre los territorios de la congregación"
  },
  "terr.novo": {
    "pt": "Novo Território",
    "es": "Nuevo Territorio"
  },
  "terr.todos_bairros": {
    "pt": "Todos os bairros",
    "es": "Todos los barrios"
  },
  "terr.selecionados": {
    "pt": "território(s) selecionado(s)",
    "es": "territorio(s) seleccionado(s)"
  },
  "terr.limpar": {
    "pt": "Limpar",
    "es": "Limpiar"
  },
  "terr.designar_selecionados": {
    "pt": "Designar Selecionados",
    "es": "Asignar Seleccionados"
  },
  "terr.nenhum": {
    "pt": "Nenhum território",
    "es": "Ningún territorio"
  },
  "terr.nenhum_msg": {
    "pt": "Crie ou aguarde a designação de territórios.",
    "es": "Cree o espere la asignación de territorios."
  },
  "terr.sem_bairro": {
    "pt": "Sem bairro",
    "es": "Sin barrio"
  },
  "terr.designado_para": {
    "pt": "Designado para:",
    "es": "Asignado a:"
  },
  "terr.excluir_titulo": {
    "pt": "Excluir território",
    "es": "Excluir territorio"
  },
  "terr.excluir_msg": {
    "pt": "Deseja realmente excluir este território? Esta ação não pode ser desfeita.",
    "es": "¿Desea realmente excluir este territorio? Esta acción no puede deshacerse."
  },
  "terr.editar_titulo": {
    "pt": "Editar Território",
    "es": "Editar Territorio"
  },
  "terr.novo_titulo": {
    "pt": "Novo Território",
    "es": "Nuevo Territorio"
  },
  "terr.nome": {
    "pt": "Nome",
    "es": "Nombre"
  },
  "terr.cidade": {
    "pt": "Cidade",
    "es": "Ciudad"
  },
  "terr.bairro": {
    "pt": "Bairro",
    "es": "Barrio"
  },
  "terr.descricao": {
    "pt": "Descrição",
    "es": "Descripción"
  },
  "terr.latitude": {
    "pt": "Latitude (centro)",
    "es": "Latitud (centro)"
  },
  "terr.longitude": {
    "pt": "Longitude (centro)",
    "es": "Longitud (centro)"
  },
  "terr.salvar": {
    "pt": "Salvar",
    "es": "Guardar"
  },
  "terr.criar": {
    "pt": "Criar",
    "es": "Crear"
  },
  "terr.excluido": {
    "pt": "Território excluído",
    "es": "Territorio excluido"
  },
  "terr.atualizado": {
    "pt": "Território atualizado",
    "es": "Territorio actualizado"
  },
  "terr.criado": {
    "pt": "Território criado",
    "es": "Territorio creado"
  },
  "meus.subtitulo": {
    "pt": "Territórios designados a você",
    "es": "Territorios asignados a usted"
  },
  "meus.nenhum": {
    "pt": "Nenhum território",
    "es": "Ningún territorio"
  },
  "meus.nenhum_msg": {
    "pt": "Nenhum território designado a você no momento.",
    "es": "Ningún territorio asignado a usted en este momento."
  },
  "end.subtitulo": {
    "pt": "Todos os endereços disponíveis para você",
    "es": "Todas las direcciones disponibles para usted"
  },
  "end.gerando": {
    "pt": "Gerando...",
    "es": "Generando..."
  },
  "end.cadastrados": {
    "pt": "Endereços cadastrados",
    "es": "Direcciones registradas"
  },
  "end.buscar": {
    "pt": "Buscar endereço...",
    "es": "Buscar dirección..."
  },
  "end.todos_status": {
    "pt": "Todos os status",
    "es": "Todos los estados"
  },
  "end.nenhum": {
    "pt": "Nenhum endereço",
    "es": "Ninguna dirección"
  },
  "end.nenhum_msg": {
    "pt": "Não há endereços para exibir.",
    "es": "No hay direcciones para mostrar."
  },
  "end.excluido": {
    "pt": "Endereço excluído",
    "es": "Dirección excluida"
  },
  "end.excluir_titulo": {
    "pt": "Excluir endereço",
    "es": "Excluir dirección"
  },
  "end.excluir_msg": {
    "pt": "Deseja realmente excluir este endereço?",
    "es": "¿Desea realmente excluir esta dirección?"
  },
  "prog.subtitulo": {
    "pt": "Dias, horários e locais de campo",
    "es": "Días, horarios y lugares de campo"
  },
  "prog.nova": {
    "pt": "Nova Programação",
    "es": "Nueva Programación"
  },
  "prog.sem": {
    "pt": "Sem programações",
    "es": "Sin programaciones"
  },
  "prog.sem_msg": {
    "pt": "Adicione os dias e horários de campo da congregação.",
    "es": "Añada los días y horarios de campo de la congregación."
  },
  "prog.nova_titulo": {
    "pt": "Nova Programação de Campo",
    "es": "Nueva Programación de Campo"
  },
  "prog.data": {
    "pt": "Data",
    "es": "Fecha"
  },
  "prog.hora": {
    "pt": "Hora",
    "es": "Hora"
  },
  "prog.local": {
    "pt": "Local",
    "es": "Lugar"
  },
  "prog.idioma": {
    "pt": "Idioma",
    "es": "Idioma"
  },
  "prog.descricao": {
    "pt": "Descrição",
    "es": "Descripción"
  },
  "prog.salvar": {
    "pt": "Salvar",
    "es": "Guardar"
  },
  "prog.informe_data_local": {
    "pt": "Informe a data e o local",
    "es": "Informe la fecha y el lugar"
  },
  "prog.adicionada": {
    "pt": "Programação adicionada",
    "es": "Programación añadida"
  },
  "prog.excluida": {
    "pt": "Programação excluída",
    "es": "Programación excluida"
  },
  "prog.excluir_titulo": {
    "pt": "Excluir programação",
    "es": "Excluir programación"
  },
  "prog.excluir_msg": {
    "pt": "Deseja realmente excluir esta programação de campo?",
    "es": "¿Desea realmente excluir esta programación de campo?"
  },
  "mapa.titulo": {
    "pt": "Mapa Geral da Congregação",
    "es": "Mapa General de la Congregación"
  },
  "mapa.subtitulo": {
    "pt": "Todos os endereços cadastrados marcados no mapa",
    "es": "Todas las direcciones registradas marcadas en el mapa"
  },
  "mapa.limpar_filtros": {
    "pt": "Limpar filtros",
    "es": "Limpiar filtros"
  },
  "mapa.sem_enderecos": {
    "pt": "Sem endereços",
    "es": "Sin direcciones"
  },
  "mapa.sem_enderecos_msg": {
    "pt": "Nenhum endereço cadastrado com coordenadas para exibir no mapa.",
    "es": "Ninguna dirección registrada con coordenadas para mostrar en el mapa."
  },
  "mapa.exibidos": {
    "pt": "endereço(s) exibido(s)",
    "es": "dirección(es) mostrada(s)"
  },
  "td.voltar": {
    "pt": "Voltar",
    "es": "Volver"
  },
  "td.revogar": {
    "pt": "Revogar",
    "es": "Revocar"
  },
  "td.designar": {
    "pt": "Designar Território",
    "es": "Asignar Territorio"
  },
  "td.status": {
    "pt": "Status",
    "es": "Estado"
  },
  "td.concluido": {
    "pt": "Território concluído",
    "es": "Territorio completado"
  },
  "td.apenas_leitura": {
    "pt": "Você não pode mais alterar as informações registradas.",
    "es": "Ya no puede modificar la información registrada."
  },
  "td.trabalho_finalizado": {
    "pt": "O trabalho de campo foi finalizado.",
    "es": "El trabajo de campo ha finalizado."
  },
  "td.concluido_em": {
    "pt": "Concluído em",
    "es": "Completado el"
  },
  "td.mapa_territorio": {
    "pt": "Mapa do Território",
    "es": "Mapa del Territorio"
  },
  "td.adicionar_endereco": {
    "pt": "Adicionar endereço",
    "es": "Añadir dirección"
  },
  "td.dica_mapa": {
    "pt": "Dica: clique no mapa para adicionar um endereço.",
    "es": "Consejo: haga clic en el mapa para añadir una dirección."
  },
  "td.sem_enderecos": {
    "pt": "Sem endereços",
    "es": "Sin direcciones"
  },
  "td.sem_enderecos_msg": {
    "pt": "Adicione endereços clicando no mapa ou no botão acima.",
    "es": "Añada direcciones haciendo clic en el mapa o en el botón de arriba."
  },
  "td.confirmado": {
    "pt": "Confirmado",
    "es": "Confirmado"
  },
  "td.pendente": {
    "pt": "Pendente",
    "es": "Pendiente"
  },
  "td.detalhes": {
    "pt": "Detalhes",
    "es": "Detalles"
  },
  "td.navegar": {
    "pt": "Navegar até o endereço",
    "es": "Navegar a la dirección"
  },
  "td.confirmar": {
    "pt": "Confirmar",
    "es": "Confirmar"
  },
  "td.endereco_salvo": {
    "pt": "Endereço salvo",
    "es": "Dirección guardada"
  },
  "td.endereco_confirmado": {
    "pt": "Endereço confirmado",
    "es": "Dirección confirmada"
  },
  "td.visita_registrada": {
    "pt": "Visita registrada",
    "es": "Visita registrada"
  },
  "td.territorio_concluido_lib": {
    "pt": "Território concluído e liberado para nova designação.",
    "es": "Territorio completado y liberado para nueva asignación."
  },
  "td.designacao_revogada": {
    "pt": "Designação revogada",
    "es": "Asignación revocada"
  },
  "td.endereco_excluido": {
    "pt": "Endereço excluído",
    "es": "Dirección excluida"
  },
  "td.excluir_endereco_titulo": {
    "pt": "Excluir endereço",
    "es": "Excluir dirección"
  },
  "td.excluir_endereco_msg": {
    "pt": "Deseja realmente excluir este endereço?",
    "es": "¿Desea realmente excluir esta dirección?"
  },
  "td.revogar_titulo": {
    "pt": "Revogar designação",
    "es": "Revocar asignación"
  },
  "td.revogar_msg": {
    "pt": "Deseja revogar a designação atual deste território? Após revogar, você poderá designá-lo novamente.",
    "es": "¿Desea revocar la asignación actual de este territorio? Tras revocar, podrá asignarlo nuevamente."
  },
  "td.revogando": {
    "pt": "Revogando...",
    "es": "Revocando..."
  },
  "td.concluir": {
    "pt": "Concluir Território",
    "es": "Completar Territorio"
  },
  "td.concluir_titulo": {
    "pt": "Concluir território",
    "es": "Completar territorio"
  },
  "td.concluir_msg": {
    "pt": "Deseja concluir este território? O trabalho de campo será finalizado e o território liberado para nova designação.",
    "es": "¿Desea completar este territorio? El trabajo de campo será finalizado y el territorio liberado para nueva asignación."
  },
  "td.concluindo": {
    "pt": "Concluindo...",
    "es": "Completando..."
  },
  "td.concluido_sucesso": {
    "pt": "Território concluído com sucesso",
    "es": "Territorio completado con éxito"
  },
  "td.nao_encontrado": {
    "pt": "Território não encontrado",
    "es": "Territorio no encontrado"
  },
  "td.nao_encontrado_msg": {
    "pt": "O território não existe ou você não tem acesso.",
    "es": "El territorio no existe o no tiene acceso."
  },
  "common.erro": {
    "pt": "Erro",
    "es": "Error"
  },
  "common.fechar": {
    "pt": "Fechar",
    "es": "Cerrar"
  },
  "common.ja_convidado": {
    "pt": "Já convidado",
    "es": "Ya invitado"
  },
  "common.salvar": {
    "pt": "Salvar",
    "es": "Guardar"
  },
  "common.editar": {
    "pt": "Editar",
    "es": "Editar"
  },
  "common.excluir": {
    "pt": "Excluir",
    "es": "Excluir"
  },
  "common.selecione": {
    "pt": "Selecione...",
    "es": "Seleccione..."
  },
  "common.ativo": {
    "pt": "Ativo",
    "es": "Activo"
  },
  "common.inativo": {
    "pt": "Inativo",
    "es": "Inactivo"
  },
  "common.salvando": {
    "pt": "Salvando...",
    "es": "Guardando..."
  },
  "desig.subtitulo": {
    "pt": "Histórico de designações de territórios",
    "es": "Historial de asignaciones de territorios"
  },
  "desig.para_dirigentes": {
    "pt": "Para Dirigentes",
    "es": "Para Dirigentes"
  },
  "desig.para_publicadores": {
    "pt": "Para Publicadores",
    "es": "Para Publicadores"
  },
  "desig.sem": {
    "pt": "Sem designações",
    "es": "Sin asignaciones"
  },
  "desig.nenhuma_msg": {
    "pt": "Nenhuma designação registrada.",
    "es": "Ninguna asignación registrada."
  },
  "desig.inicio": {
    "pt": "Início:",
    "es": "Inicio:"
  },
  "desig.dirigente_prefix": {
    "pt": "Dirigente:",
    "es": "Dirigente:"
  },
  "desig.excluir_titulo": {
    "pt": "Excluir designação",
    "es": "Excluir asignación"
  },
  "desig.excluir_msg": {
    "pt": "Deseja realmente excluir este registro de designação? Esta ação não pode ser desfeita.",
    "es": "¿Desea realmente excluir este registro de asignación? Esta acción no puede deshacerse."
  },
  "desig.excluido": {
    "pt": "Registro de designação excluído",
    "es": "Registro de asignación excluido"
  },
  "desig.ativa": {
    "pt": "Ativa",
    "es": "Activa"
  },
  "desig.encerrada": {
    "pt": "Encerrada",
    "es": "Cerrada"
  },
  "desig.programada": {
    "pt": "Programada",
    "es": "Programada"
  },
  "vis.subtitulo": {
    "pt": "Histórico de visitas registradas em campo",
    "es": "Historial de visitas registradas en campo"
  },
  "vis.limpar_historico": {
    "pt": "Limpar histórico",
    "es": "Limpiar historial"
  },
  "vis.exclusao_geral": {
    "pt": "Exclusão geral",
    "es": "Exclusión general"
  },
  "vis.limpar_titulo": {
    "pt": "Limpar histórico de visitas",
    "es": "Limpiar historial de visitas"
  },
  "vis.limpar_msg": {
    "pt": "Isto irá apagar TODAS as visitas registradas. Deseja continuar?",
    "es": "Esto borrará TODAS las visitas registradas. ¿Desea continuar?"
  },
  "vis.geral_msg": {
    "pt": "Isto irá apagar TODAS as visitas registradas e as informações de visitas nos relatórios. Endereços, mapas e designações serão mantidos. Deseja continuar?",
    "es": "Esto borrará TODAS las visitas registradas y la información de visitas en los informes. Direcciones, mapas y asignaciones se mantendrán. ¿Desea continuar?"
  },
  "vis.exclusao_concluida": {
    "pt": "Exclusão geral concluída",
    "es": "Exclusión general completada"
  },
  "vis.historico_limpo": {
    "pt": "Histórico limpo",
    "es": "Historial limpiado"
  },
  "pub.subtitulo": {
    "pt": "Todos os usuários elegíveis para designação de territórios",
    "es": "Todos los usuarios elegibles para asignación de territorios"
  },
  "pub.sem": {
    "pt": "Sem usuários",
    "es": "Sin usuarios"
  },
  "pub.sem_msg": {
    "pt": "Nenhum usuário cadastrado ainda.",
    "es": "Ningún usuario registrado aún."
  },
  "pub.sem_nome": {
    "pt": "Sem nome",
    "es": "Sin nombre"
  },
  "pub.voce": {
    "pt": "(você)",
    "es": "(usted)"
  },
  "pub.gerenciar": {
    "pt": "Gerenciar",
    "es": "Administrar"
  },
  "pub.gerenciar_titulo": {
    "pt": "Gerenciar Usuário",
    "es": "Administrar Usuario"
  },
  "pub.definir_dirigente": {
    "pt": "Definir como Dirigente",
    "es": "Definir como Dirigente"
  },
  "pub.definir_dirigente_desc": {
    "pt": "Poderá designar territórios a publicadores",
    "es": "Podrá asignar territorios a publicadores"
  },
  "pub.definir_adm": {
    "pt": "Definir como ADM",
    "es": "Definir como ADM"
  },
  "pub.definir_adm_desc": {
    "pt": "Controle total do sistema",
    "es": "Control total del sistema"
  },
  "pub.definir_publicador": {
    "pt": "Definir como Publicador",
    "es": "Definir como Publicador"
  },
  "pub.definir_publicador_desc": {
    "pt": "Receberá designações de territórios",
    "es": "Recibirá asignaciones de territorios"
  },
  "pub.excluir_titulo": {
    "pt": "Excluir usuário",
    "es": "Excluir usuario"
  },
  "pub.excluir_msg": {
    "pt": "Deseja desativar este usuário? A sessão dele será revogada, mas a conta é preservada e ele poderá logar novamente no futuro.",
    "es": "¿Desea desactivar a este usuario? Se revocará su sesión, pero la cuenta se preserva y podrá iniciar sesión nuevamente en el futuro."
  },
  "pub.desativar": {
    "pt": "Desativar",
    "es": "Desactivar"
  },
  "pub.desativando": {
    "pt": "Desativando...",
    "es": "Desactivando..."
  },
  "pub.desativado": {
    "pt": "Usuário desativado",
    "es": "Usuario desactivado"
  },
  "pub.desativado_desc": {
    "pt": "A sessão dele foi revogada. Ele poderá logar novamente no futuro.",
    "es": "Su sesión fue revocada. Podrá iniciar sesión nuevamente en el futuro."
  },
  "pub.atualizado": {
    "pt": "Usuário atualizado",
    "es": "Usuario actualizado"
  },
  "dir.subtitulo": {
    "pt": "Dirigentes responsáveis por territórios",
    "es": "Dirigentes responsables de territorios"
  },
  "dir.sem": {
    "pt": "Sem dirigentes",
    "es": "Sin dirigentes"
  },
  "dir.sem_msg": {
    "pt": "Promova um publicador a dirigente na aba Publicadores.",
    "es": "Promueva un publicador a dirigente en la pestaña Publicadores."
  },
  "dir.redefinir": {
    "pt": "Redefinir",
    "es": "Restablecer"
  },
  "dir.redefinir_titulo": {
    "pt": "Redefinir usuário",
    "es": "Restablecer usuario"
  },
  "dir.redefinir_msg": {
    "pt": "Deseja redefinir este usuário para Publicador? Ele deixará de ter territórios designados como dirigente.",
    "es": "¿Desea restablecer este usuario a Publicador? Dejará de tener territorios asignados como dirigente."
  },
  "dir.redefinido": {
    "pt": "Usuário redefinido para Publicador",
    "es": "Usuario restablecido a Publicador"
  },
  "dir.excluir_msg": {
    "pt": "Deseja realmente excluir este usuário? Esta ação é definitiva.",
    "es": "¿Desea realmente excluir este usuario? Esta acción es definitiva."
  },
  "dir.excluido": {
    "pt": "Usuário excluído",
    "es": "Usuario excluido"
  },
  "camp.subtitulo": {
    "pt": "Gerencie campanhas de convite para o campo",
    "es": "Administre campañas de invitación para el campo"
  },
  "camp.nova": {
    "pt": "Nova Campanha",
    "es": "Nueva Campaña"
  },
  "camp.sem": {
    "pt": "Nenhuma campanha",
    "es": "Ninguna campaña"
  },
  "camp.sem_msg": {
    "pt": "Crie uma campanha para que os publicadores possam marcar convidados no registro de visitas.",
    "es": "Cree una campaña para que los publicadores puedan marcar invitados en el registro de visitas."
  },
  "camp.inicio": {
    "pt": "Início:",
    "es": "Inicio:"
  },
  "camp.fim": {
    "pt": "Fim:",
    "es": "Fin:"
  },
  "camp.desativar": {
    "pt": "Desativar",
    "es": "Desactivar"
  },
  "camp.ativar": {
    "pt": "Ativar",
    "es": "Activar"
  },
  "camp.editar_titulo": {
    "pt": "Editar Campanha",
    "es": "Editar Campaña"
  },
  "camp.nova_titulo": {
    "pt": "Nova Campanha",
    "es": "Nueva Campaña"
  },
  "camp.nome_placeholder": {
    "pt": "Nome da campanha",
    "es": "Nombre de la campaña"
  },
  "camp.inicio_label": {
    "pt": "Início",
    "es": "Inicio"
  },
  "camp.fim_label": {
    "pt": "Fim",
    "es": "Fin"
  },
  "camp.informe_nome": {
    "pt": "Informe o nome da campanha",
    "es": "Informe el nombre de la campaña"
  },
  "camp.atualizada": {
    "pt": "Campanha atualizada",
    "es": "Campaña actualizada"
  },
  "camp.criada": {
    "pt": "Campanha criada",
    "es": "Campaña creada"
  },
  "camp.desativada": {
    "pt": "Campanha desativada",
    "es": "Campaña desactivada"
  },
  "camp.ativada": {
    "pt": "Campanha ativada",
    "es": "Campaña activada"
  },
  "camp.excluida": {
    "pt": "Campanha excluída",
    "es": "Campaña excluida"
  },
  "camp.excluir_titulo": {
    "pt": "Excluir campanha",
    "es": "Excluir campaña"
  },
  "camp.excluir_msg": {
    "pt": "Deseja realmente excluir esta campanha?",
    "es": "¿Desea realmente excluir esta campaña?"
  },
  "config.subtitulo": {
    "pt": "Preferências e informações da conta",
    "es": "Preferencias e información de la cuenta"
  },
  "config.perfil": {
    "pt": "Perfil",
    "es": "Perfil"
  },
  "config.email": {
    "pt": "E-mail",
    "es": "Correo electrónico"
  },
  "config.tipo_usuario": {
    "pt": "Tipo de usuário",
    "es": "Tipo de usuario"
  },
  "config.notificacoes": {
    "pt": "Notificações",
    "es": "Notificaciones"
  },
  "config.notif_desc": {
    "pt": "Notificações em tempo real estão ativas. Você recebe um alerta instantâneo quando um território for designado a você.",
    "es": "Las notificaciones en tiempo real están activas. Recibe una alerta instantánea cuando se le asigne un territorio."
  },
  "config.enviar_teste": {
    "pt": "Enviar notificação de teste",
    "es": "Enviar notificación de prueba"
  },
  "config.enviando": {
    "pt": "Enviando...",
    "es": "Enviando..."
  },
  "config.notif_teste_titulo": {
    "pt": "Notificação de teste",
    "es": "Notificación de prueba"
  },
  "config.notif_teste_msg": {
    "pt": "Seu sistema de notificações está funcionando corretamente.",
    "es": "Su sistema de notificaciones está funcionando correctamente."
  },
  "config.notif_enviada": {
    "pt": "Notificação de teste enviada",
    "es": "Notificación de prueba enviada"
  },
  "config.push_msg": {
    "pt": "Para receber notificações push no dispositivo (app fechado/background), é necessário configurar o Firebase Cloud Messaging. As notificações em tempo real dentro do aplicativo já funcionam automaticamente.",
    "es": "Para recibir notificaciones push en el dispositivo (app cerrada/en segundo plano), es necesario configurar Firebase Cloud Messaging. Las notificaciones en tiempo real dentro de la aplicación ya funcionan automáticamente."
  },
  "config.permissoes": {
    "pt": "Permissões",
    "es": "Permisos"
  },
  "config.perm_adm": {
    "pt": "• Controle total: territórios, designações, usuários e relatórios.",
    "es": "• Control total: territorios, asignaciones, usuarios e informes."
  },
  "config.perm_dirigente": {
    "pt": "• Recebe territórios do ADM e pode designá-los a publicadores.",
    "es": "• Recibe territorios del ADM y puede asignarlos a publicadores."
  },
  "config.perm_publicador": {
    "pt": "• Visualiza apenas os territórios designados a você e registra visitas.",
    "es": "• Visualiza solo los territorios asignados a usted y registra visitas."
  },
  "config.sobre": {
    "pt": "Sobre",
    "es": "Acerca de"
  },
  "config.sobre_msg": {
    "pt": "Sistema de Gestão de Territórios para congregação. Mapa interativo, designações em dois níveis, registro de visitas em campo e notificações em tempo real.",
    "es": "Sistema de Gestión de Territorios para congregación. Mapa interactivo, asignaciones en dos niveles, registro de visitas en campo y notificaciones en tiempo real."
  },
  "prog_desig.subtitulo": {
    "pt": "Agende designações de mapas aos dirigentes (visíveis 6h antes)",
    "es": "Programe asignaciones de mapas a los dirigentes (visibles 6h antes)"
  },
  "prog_desig.nova": {
    "pt": "Nova programação",
    "es": "Nueva programación"
  },
  "prog_desig.selecione": {
    "pt": "Selecione...",
    "es": "Seleccione..."
  },
  "prog_desig.observacoes": {
    "pt": "Observações",
    "es": "Observaciones"
  },
  "prog_desig.mapas_disponiveis": {
    "pt": "Mapas disponíveis",
    "es": "Mapas disponibles"
  },
  "prog_desig.sem_mapas": {
    "pt": "Nenhum mapa disponível para programar.",
    "es": "Ningún mapa disponible para programar."
  },
  "prog_desig.programar": {
    "pt": "Programar",
    "es": "Programar"
  },
  "prog_desig.preencha": {
    "pt": "Preencha data, hora, dirigente e ao menos um mapa",
    "es": "Complete fecha, hora, dirigente y al menos un mapa"
  },
  "prog_desig.programadas": {
    "pt": "Designações programadas",
    "es": "Asignaciones programadas"
  },
  "prog_desig.criada_s": {
    "pt": "criada(s)",
    "es": "creada(s)"
  },
  "prog_desig.sem_programacao": {
    "pt": "Nenhuma programação",
    "es": "Ninguna programación"
  },
  "prog_desig.sem_programacao_msg": {
    "pt": "As designações agendadas aparecerão aqui.",
    "es": "Las asignaciones programadas aparecerán aquí."
  },
  "prog_desig.para": {
    "pt": "Para:",
    "es": "Para:"
  },
  "prog_desig.cancelar_titulo": {
    "pt": "Cancelar programação",
    "es": "Cancelar programación"
  },
  "prog_desig.cancelar_msg": {
    "pt": "Deseja cancelar esta designação programada? O mapa voltará a ficar disponível.",
    "es": "¿Desea cancelar esta asignación programada? El mapa volverá a estar disponible."
  },
  "prog_desig.cancelando": {
    "pt": "Cancelando...",
    "es": "Cancelando..."
  },
  "prog_desig.cancelada": {
    "pt": "Designação cancelada",
    "es": "Asignación cancelada"
  },
  "rel.subtitulo": {
    "pt": "Visão geral da congregação",
    "es": "Visión general de la congregación"
  },
  "rel.periodo_inicial": {
    "pt": "Período · Data inicial",
    "es": "Período · Fecha inicial"
  },
  "rel.data_final": {
    "pt": "Data final",
    "es": "Fecha final"
  },
  "rel.gerando": {
    "pt": "Gerando...",
    "es": "Generando..."
  },
  "rel.limpar_periodo": {
    "pt": "Limpar período",
    "es": "Limpiar período"
  },
  "rel.em_campo": {
    "pt": "Em campo",
    "es": "En campo"
  },
  "rel.territorios_status": {
    "pt": "Territórios por status",
    "es": "Territorios por estado"
  },
  "rel.sem_dados": {
    "pt": "Sem dados",
    "es": "Sin datos"
  },
  "rel.visitas_resultado": {
    "pt": "Visitas por resultado",
    "es": "Visitas por resultado"
  },
  "mapa.confirmado": {
    "pt": "Endereço confirmado",
    "es": "Dirección confirmada"
  },
  "mapa.pendente": {
    "pt": "Pendente de confirmação",
    "es": "Pendiente de confirmación"
  },
  "mapa.status": {
    "pt": "Status:",
    "es": "Estado:"
  },
  "mapa.navegar": {
    "pt": "Navegar",
    "es": "Navegar"
  },
  "endf.editar": {
    "pt": "Editar Endereço",
    "es": "Editar Dirección"
  },
  "endf.novo": {
    "pt": "Novo Endereço",
    "es": "Nueva Dirección"
  },
  "endf.rua": {
    "pt": "Rua",
    "es": "Calle"
  },
  "endf.numero": {
    "pt": "Número",
    "es": "Número"
  },
  "endf.complemento": {
    "pt": "Complemento",
    "es": "Complemento"
  },
  "endf.confirmacao": {
    "pt": "Confirmação de Endereço",
    "es": "Confirmación de Dirección"
  },
  "lote.titulo": {
    "pt": "Designar Territórios em Lote",
    "es": "Asignar Territorios en Lote"
  },
  "lote.designado_s": {
    "pt": "território(s) designado(s)",
    "es": "territorio(s) asignado(s)"
  },
  "lote.nao_designado_s": {
    "pt": "não designado(s)",
    "es": "no asignado(s)"
  },
  "lote.ja_designados": {
    "pt": "Territórios já designados devem ser revogados antes de nova designação.",
    "es": "Los territorios ya asignados deben revocarse antes de una nueva asignación."
  },
  "lote.selecionados": {
    "pt": "Territórios selecionados",
    "es": "Territorios seleccionados"
  },
  "lote.nenhum_usuario": {
    "pt": "Nenhum usuário disponível.",
    "es": "Ningún usuario disponible."
  },
  "lote.designar": {
    "pt": "Designar",
    "es": "Asignar"
  },
  "lote.territorio_s": {
    "pt": "território(s)",
    "es": "territorio(s)"
  },
  "lote.concluida": {
    "pt": "Designação em lote concluída",
    "es": "Asignación en lote completada"
  },
  "notif.titulo": {
    "pt": "Notificações",
    "es": "Notificaciones"
  },
  "notif.marcar_todas": {
    "pt": "Marcar todas",
    "es": "Marcar todas"
  },
  "notif.sem": {
    "pt": "Sem notificações",
    "es": "Sin notificaciones"
  },
  "notif.nova": {
    "pt": "Nova notificação",
    "es": "Nueva notificación"
  },
  "rdesig.titulo": {
    "pt": "Registro de Designação de Território",
    "es": "Registro de Asignación de Territorio"
  },
  "rdesig.sem": {
    "pt": "Nenhuma designação registrada.",
    "es": "Ninguna asignación registrada."
  },
  "rdesig.num_territorio": {
    "pt": "Nº Território",
    "es": "Nº Territorio"
  },
  "rdesig.designado_para": {
    "pt": "Designado para",
    "es": "Asignado a"
  },
  "rdesig.data_designacao": {
    "pt": "Data designação",
    "es": "Fecha asignación"
  },
  "rdesig.data_conclusao": {
    "pt": "Data conclusão",
    "es": "Fecha conclusión"
  },
  "rdesig.ultima_conclusao": {
    "pt": "Última conclusão",
    "es": "Última conclusión"
  },
  "confirm.excluir": {
    "pt": "Excluir",
    "es": "Excluir"
  },
  "confirm.excluindo": {
    "pt": "Excluindo...",
    "es": "Excluyendo..."
  },
  "layout.gestao": {
    "pt": "Gestão de Territórios",
    "es": "Gestión de Territorios"
  },
  "layout.usuario": {
    "pt": "Usuário",
    "es": "Usuario"
  },
  "sidebar.app": {
    "pt": "Territórios",
    "es": "Territorios"
  },
  "sidebar.congregacao": {
    "pt": "Congregação",
    "es": "Congregación"
  },
  "nav.aprovacoes": {
    "pt": "Aprovações",
    "es": "Aprobaciones"
  },
  "aprov.titulo": {
    "pt": "Aprovações de Publicadores",
    "es": "Aprobaciones de Publicadores"
  },
  "aprov.subtitulo": {
    "pt": "Novos logins aguardando sua aprovação",
    "es": "Nuevos inicios de sesión esperando su aprobación"
  },
  "aprov.nenhum": {
    "pt": "Nenhum publicador aguardando aprovação",
    "es": "Ningún publicador esperando aprobación"
  },
  "aprov.nenhum_msg": {
    "pt": "Quando alguém fizer login, aparecerá aqui para você aprovar.",
    "es": "Cuando alguien inicie sesión, aparecerá aquí para que lo apruebes."
  },
  "aprov.solicitou_em": {
    "pt": "Solicitou em",
    "es": "Solicitó el"
  },
  "aprov.aprovar": {
    "pt": "Aprovar",
    "es": "Aprobar"
  },
  "aprov.rejeitar": {
    "pt": "Rejeitar",
    "es": "Rechazar"
  },
  "aprov.aprovado_ok": {
    "pt": "Publicador aprovado com sucesso",
    "es": "Publicador aprobado con éxito"
  },
  "aprov.rejeitado_ok": {
    "pt": "Acesso rejeitado",
    "es": "Acceso rechazado"
  },
  "aprov.pendente_titulo": {
    "pt": "Acesso em análise",
    "es": "Acceso en revisión"
  },
  "aprov.pendente_msg": {
    "pt": "Seu acesso está aguardando aprovação do administrador. Você receberá acesso em breve.",
    "es": "Su acceso está esperando la aprobación del administrador. Recibirá acceso pronto."
  },
  "aprov.rejeitado_titulo": {
    "pt": "Acesso não autorizado",
    "es": "Acceso no autorizado"
  },
  "aprov.rejeitado_msg": {
    "pt": "Seu acesso não foi autorizado. Entre em contato com o administrador.",
    "es": "Su acceso no fue autorizado. Contacte al administrador."
  },
  "pub.excluir_definitivo": {
    "pt": "Excluir Definitivamente",
    "es": "Eliminar Definitivamente"
  },
  "pub.excluir_definitivo_desc": {
    "pt": "Remove o registro. Se logar novamente, precisará ser aprovado.",
    "es": "Elimina el registro. Si inicia sesión de nuevo, necesitará aprobación."
  },
  "pub.excluido_definitivo": {
    "pt": "Usuário excluído",
    "es": "Usuario eliminado"
  },
  "pub.excluido_definitivo_desc": {
    "pt": "O usuário foi removido definitivamente.",
    "es": "El usuario fue eliminado definitivamente."
  },
  "nav.painel": {
    "pt": "Painel Admin",
    "es": "Panel Admin"
  },
  "painel.titulo": {
    "pt": "Painel Administrativo",
    "es": "Panel Administrativo"
  },
  "painel.subtitulo": {
    "pt": "Status dos territórios e progresso das visitas em tempo real",
    "es": "Estado de los territorios y progreso de las visitas en tiempo real"
  },
  "painel.progresso_enderecos": {
    "pt": "Progresso de Endereços",
    "es": "Progreso de Direcciones"
  },
  "painel.total_enderecos": {
    "pt": "Total",
    "es": "Total"
  },
  "painel.visitados": {
    "pt": "Visitados",
    "es": "Visitados"
  },
  "painel.pendentes": {
    "pt": "Pendentes",
    "es": "Pendientes"
  },
  "painel.progresso_global": {
    "pt": "Progresso Global",
    "es": "Progreso Global"
  },
  "painel.resultados_visitas": {
    "pt": "Resultados das Visitas",
    "es": "Resultados de las Visitas"
  },
  "painel.status_territorios": {
    "pt": "Status dos Territórios",
    "es": "Estado de los Territorios"
  },
  "painel.atividade_recente": {
    "pt": "Atividade Recente",
    "es": "Actividad Reciente"
  },
  "nav.censo": {
    "pt": "Censo",
    "es": "Censo"
  },
  "censo.titulo": {
    "pt": "Censo de Endereços",
    "es": "Censo de Direcciones"
  },
  "censo.subtitulo": {
    "pt": "Cadastre os endereços do censo para confirmação e integração aos mapas",
    "es": "Registre las direcciones del censo para confirmación e integración a los mapas"
  },
  "censo.novo": {
    "pt": "Novo Endereço",
    "es": "Nueva Dirección"
  },
  "censo.editar": {
    "pt": "Editar Endereço",
    "es": "Editar Dirección"
  },
  "censo.pendentes": {
    "pt": "Pendentes",
    "es": "Pendientes"
  },
  "censo.confirmados": {
    "pt": "Confirmados",
    "es": "Confirmados"
  },
  "censo.buscar": {
    "pt": "Buscar endereço...",
    "es": "Buscar dirección..."
  },
  "censo.todos_status": {
    "pt": "Todos os status",
    "es": "Todos los estados"
  },
  "censo.nenhum": {
    "pt": "Nenhum endereço cadastrado",
    "es": "Ninguna dirección registrada"
  },
  "censo.nenhum_msg": {
    "pt": "Cadastre os endereços do censo realizado nos territórios.",
    "es": "Registre las direcciones del censo realizado en los territorios."
  },
  "censo.confirmar": {
    "pt": "Confirmar",
    "es": "Confirmar"
  },
  "censo.confirmado_sucesso": {
    "pt": "Endereço confirmado!",
    "es": "¡Dirección confirmada!"
  },
  "censo.cadastrado": {
    "pt": "Endereço cadastrado no censo!",
    "es": "¡Dirección registrada en el censo!"
  },
  "censo.atualizado": {
    "pt": "Endereço atualizado!",
    "es": "¡Dirección actualizada!"
  },
  "censo.excluido": {
    "pt": "Endereço excluído do censo.",
    "es": "Dirección eliminada del censo."
  },
  "censo.excluir_titulo": {
    "pt": "Excluir endereço do censo",
    "es": "Excluir dirección del censo"
  },
  "censo.excluir_msg": {
    "pt": "Deseja realmente excluir este endereço do censo?",
    "es": "¿Desea realmente excluir esta dirección del censo?"
  },
  "censo.integrar": {
    "pt": "Integrar ao Mapa",
    "es": "Integrar al Mapa"
  },
  "censo.integrar_titulo": {
    "pt": "Integrar Endereço ao Mapa",
    "es": "Integrar Dirección al Mapa"
  },
  "censo.integrar_existente": {
    "pt": "Adicionar a território existente",
    "es": "Añadir a territorio existente"
  },
  "censo.integrar_novo": {
    "pt": "Criar novo território",
    "es": "Crear nuevo territorio"
  },
  "censo.selecionar_territorio": {
    "pt": "Selecione o território",
    "es": "Seleccione el territorio"
  },
  "censo.nome_novo": {
    "pt": "Nome do novo território",
    "es": "Nombre del nuevo territorio"
  },
  "censo.nome_novo_placeholder": {
    "pt": "Ex: Centro 2",
    "es": "Ej: Centro 2"
  },
  "censo.integrado": {
    "pt": "Endereço integrado ao mapa com sucesso!",
    "es": "¡Dirección integrada al mapa con éxito!"
  },
  "censo.data_censo": {
    "pt": "Data do censo",
    "es": "Fecha del censo"
  },
  "censo.territorio": {
    "pt": "Território (opcional)",
    "es": "Territorio (opcional)"
  },
  "censo.sem_territorio": {
    "pt": "Sem território vinculado",
    "es": "Sin territorio vinculado"
  },
  "censo.clique_mapa": {
    "pt": "Clique no mapa para definir a localização",
    "es": "Haga clic en el mapa para definir la ubicación"
  },
  "censo.designar": {
    "pt": "Designar",
    "es": "Asignar"
  },
  "censo.designar_titulo": {
    "pt": "Designar Endereço do Censo",
    "es": "Asignar Dirección del Censo"
  },
  "censo.designar_para": {
    "pt": "Designar para",
    "es": "Asignar a"
  },
  "censo.designar_btn": {
    "pt": "Designar",
    "es": "Asignar"
  },
  "censo.designado_sucesso": {
    "pt": "Endereço designado com sucesso!",
    "es": "¡Dirección asignada con éxito!"
  },
  "censo.dirigente": {
    "pt": "Dirigente",
    "es": "Dirigente"
  },
  "censo.publicador": {
    "pt": "Publicador",
    "es": "Publicador"
  },
  "censo.selecionar": {
    "pt": "Selecione o",
    "es": "Seleccione el"
  },
  "censo.nenhum_usuario": {
    "pt": "Nenhum usuário disponível.",
    "es": "Ningún usuario disponible."
  },
  "censo.endereco": {
    "pt": "Endereço",
    "es": "Dirección"
  },
  "censo.designado_para": {
    "pt": "Designado para",
    "es": "Asignado a"
  },
  "censo.revogar": {
    "pt": "Revogar designação",
    "es": "Revocar asignación"
  },
  "censo.revogar_msg": {
    "pt": "Deseja revogar a designação deste endereço?",
    "es": "¿Desea revocar la asignación de esta dirección?"
  },
  "censo.revogado_sucesso": {
    "pt": "Designação revogada",
    "es": "Asignación revocada"
  },
  "censo.sem_designacao": {
    "pt": "Sem designação",
    "es": "Sin asignación"
  },
  "censo.designados": {
    "pt": "Designados",
    "es": "Asignados"
  }
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallbackOrParams?: string | Record<string, string | number>, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "pt-BR",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem("esp_mapas_lang") as Locale;
      return saved === "es" ? "es" : "pt-BR";
    } catch {
      return "pt-BR";
    }
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("esp_mapas_lang", newLocale);
    } catch {}
  };

  const t = (key: string, fallbackOrParams?: string | Record<string, string | number>, maybeParams?: Record<string, string | number>): string => {
    const entry = translations[key];
    let fallback = typeof fallbackOrParams === "string" ? fallbackOrParams : key;
    let params = typeof fallbackOrParams === "object" ? fallbackOrParams : maybeParams;

    let text = entry ? (entry[locale] || (locale === "pt-BR" ? entry["pt"] : undefined) || entry["pt-BR"] || entry["pt"] || fallback) : fallback;

    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        text = text.replace(new RegExp("{" + pKey + "}", "g"), String(pVal));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
