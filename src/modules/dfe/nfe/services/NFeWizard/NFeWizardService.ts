import XmlBuilder from '@Adapters/XmlBuilder';
import Utility from '@Core/utils/Utility';
import { NFeWizardServiceImpl } from '@Interfaces';
import GerarConsulta from '@Modules/dfe/base/GerarConsulta';
import SaveFiles from '@Modules/dfe/base/SaveFiles';
import Environment from '@Modules/environment/Environment';
import { AxiosInstance } from 'axios';
import NFEStatusServicoService from '@Modules/dfe/nfce/services/NFEStatusServico/NFEStatusServicoService';
import NFEEpec from '../../operations/NFERecepcaoEvento/NFEEpec';
import NFECancelamento from '../../operations/NFERecepcaoEvento/NFECancelamento';
import MailController from '@Adapters/MailAdapter';
import NFCEGerarDanfe from '@Modules/dfe/danfe/NFCEGerarDanfe/NFCEGerarDanfe';
import NFCEAutorizacao from '@Modules/dfe/nfce/operations/NFCEAutorizacao/NFCEAutorizacao';
import NFEInutilizacao from '../../operations/NFEInutilizacao/NFEInutilizacao';
import {
    Cancelamento,
    EmailParams,
    EPEC,
    EventoNFe,
    InutilizacaoData,
    NFe,
    NFEGerarDanfeProps,
    NFeWizardProps,
} from '@Types';
import NFEStatusServico from '../../../nfce/operations/NFEStatusServico/NFEStatusServico';
import NFERecepcaoEvento from '../../operations/NFERecepcaoEvento/NFERecepcaoEvento';
import NFERecepcaoEventoService from '../NFERecepcaoEvento/NFERecepcaoEventoService';
import NFECancelamentoService from '../NFERecepcaoEvento/NFECancelamentoService';
import NFEEpecService from '../NFERecepcaoEvento/NFEEpecService';
import NFEInutilizacaoService from '../NFEInutilizacao/NFEInutilizacaoService';
import NFCEAutorizacaoService from '@Modules/dfe/nfce/services/NFCEAutorizacao/NFCEAutorizacaoService';
import NFEconsultaProtocoloService from '../NFEConsultaProtocolo/NFEconsultaProtocoloService';
import NFEConsultaProtocolo from '../../operations/NFEConsultaProtocolo/NFEconsultaProtocolo';

class NFeWizardService implements NFeWizardServiceImpl {
    private config: NFeWizardProps = {} as NFeWizardProps;
    private environment: Environment = {} as Environment;
    private utility: Utility = {} as Utility;
    private xmlBuilder: XmlBuilder = {} as XmlBuilder;
    private axios: AxiosInstance = {} as AxiosInstance;
    private saveFiles: SaveFiles = {} as SaveFiles;
    private gerarConsulta: GerarConsulta = {} as GerarConsulta;

    constructor() {
        if (new.target) {
            return new Proxy(this, {
                get(target: NFeWizardService, prop: string | symbol, receiver: any): any {
                    const origMethod: any = target[prop as keyof typeof target];
                    if (typeof origMethod === 'function') {
                        return async function (...args: any[]): Promise<any> {
                            if (prop === 'NFCE_LoadEnvironment') {
                                return origMethod.apply(target, args);
                            }
                            // Lógica de validação antes de cada método
                            await target.validateEnvironment(prop as string);
                            // Chama o método original
                            return origMethod.apply(target, args);
                        };
                    }
                    return Reflect.get(target, prop, receiver);
                }
            });
        }
    }

    async NFCE_LoadEnvironment({ config }: { config: NFeWizardProps }) {
        try {
            this.config = config;
            // Carrega Ambiente
            this.environment = new Environment(this.config);
            const { axios } = await this.environment.loadEnvironment();
            this.axios = axios;

            // Inicia método de Utilitários
            this.utility = new Utility(this.environment)
            this.saveFiles = new SaveFiles(this.environment, this.utility);

            // Inicia método de geração de XML
            this.xmlBuilder = new XmlBuilder(this.environment)
            this.gerarConsulta = new GerarConsulta(this.environment, this.utility, this.xmlBuilder);

            console.log('===================================');
            console.log('Biblioteca Inicializada com Sucesso');
            console.log('===================================');

        } catch (error) {
            console.log(error)
            throw new Error(`Erro ao inicializar a lib: ${error}`)
        }
    }

    /**
     * Status Serviço
     */
    async NFCE_ConsultaStatusServico() {
        try {
            const nfeStatusServicoService = new NFEStatusServicoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeStatusServico = new NFEStatusServico(nfeStatusServicoService);

            const response = await nfeStatusServico.Exec();

            console.log('Retorno NFCE_ConsultaStatusServico');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response
        } catch (error: any) {
            throw new Error(`NFE_ConsultaStatusServico: ${error.message}`)
        }
    }
    /**
     * Consulta Protocolo
     */
    async NFCE_ConsultaProtocolo(chave: string) {
        try {
            const nfeConsultaProtocoloService = new NFEconsultaProtocoloService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeConsultaProtocolo = new NFEConsultaProtocolo(nfeConsultaProtocoloService);

            const response = await nfeConsultaProtocolo.Exec(chave);

            console.log('Retorno NFCE_ConsultaProtocolo');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response
        } catch (error: any) {
            throw new Error(`NFE_ConsultaProtocolo: ${error.message}`)
        }
    }
    
    /**
     * Recepção de Eventos
     */
    async NFCE_RecepcaoEvento(evento: EventoNFe) {
        try {
            const nfeRecepcaoEventoService = new NFERecepcaoEventoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeRecepcaoEvento = new NFERecepcaoEvento(nfeRecepcaoEventoService);
            const response = await nfeRecepcaoEvento.Exec(evento);

            console.log('Retorno NFCE_RecepcaoEvento');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFE_RecepcaoEvento: ${error.message}`)
        }
    }
    async NFCE_EventoPrevioDeEmissaoEmContingencia(evento: EPEC) {
        try {
            const nfeEpecService = new NFEEpecService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeEpec = new NFEEpec(nfeEpecService);
            const response = await nfeEpec.Exec(evento);

            console.log('Retorno NFEEpec');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFEEpec: ${error.message}`)
        }
    }
    async NFCE_Cancelamento(evento: Cancelamento) {
        try {
            const nfeCancelamentoService = new NFECancelamentoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeCancelamento = new NFECancelamento(nfeCancelamentoService);
            const response = await nfeCancelamento.Exec(evento);

            console.log('Retorno NFCE_Cancelamento');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFE_Cancelamento: ${error.message}`)
        }
    }

    /**
     * Autorização
     */
    async NFCE_Autorizacao(data: NFe) {
        try {
            const autorizacaoService = new NFCEAutorizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const autorizacao = new NFCEAutorizacao(autorizacaoService);
            const response = await autorizacao.Exec(data);

            console.log('Retorno NFCE_Autorizacao');
            console.table(response.xMotivo);
            console.log('===================================');

            return response.xmls
        } catch (error: any) {
            throw new Error(`NFCE_Autorizacao: ${error.message}`)
        }
    }

    /**
     * Inutilização
     */
    async NFCE_Inutilizacao(data: InutilizacaoData) {
        try {
            const inutilizacaoService = new NFEInutilizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const inutilizacao = new NFEInutilizacao(inutilizacaoService);
            const response = await inutilizacao.Exec(data);

            console.log('Retorno NFCE_Inutilizacao');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response
        } catch (error: any) {
            throw new Error(`NFE_Inutilizacao: ${error.message}`)
        }
    }


    /**
     * DANFE
     */
    async NFCE_GerarDanfe(data: NFEGerarDanfeProps) {
        try {
            const { dfe: { exibirMarcaDaguaDanfe } } = this.environment.getConfig();
            const distribuicaoDFe = new NFCEGerarDanfe(data);
            const response = await distribuicaoDFe.generatePDF(exibirMarcaDaguaDanfe);

            console.log('Retorno NFCE_GerarDanfe');
            console.log(response.message);
            console.log('===================================');

            return response
        } catch (error: any) {
            throw new Error(`NFCE_GerarDanfe: ${error.message}`)
        }
    }

    /**
     * Método para envio de e-mail
     * @param {EmailParams} mailParams - Mensagem de texto (aceita html)
     */
    NFCE_EnviaEmail(mailParams: EmailParams) {
        try {
            const mailController = new MailController(this.environment);
            const response = mailController.sendEmail(mailParams);

            console.log('Retorno NFCE_EnviaEmail');
            console.log('E-mail enviado com sucesso.');
            console.log('===================================');

            return response
        } catch (error: any) {
            throw new Error(`NFE_EnviaEmail: ${error.message}`)
        }
    }

    /**
     * Validação de ambiente
     */
    private async validateEnvironment(prop: string): Promise<void> {
        if (!this.environment.isLoaded) {
            throw new Error(`Ambiente não carregado. Por favor, carregue o ambiente utilizando o método "NFCE_LoadEnvironment({ sua_configuracao })" antes de chamar o método ${prop}.`);
        }
    }
}

export default NFeWizardService;