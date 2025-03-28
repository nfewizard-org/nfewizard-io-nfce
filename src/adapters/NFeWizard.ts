/*
 * This file is part of NFeWizard-io.
 * 
 * NFeWizard-io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NFeWizard-io is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NFeWizard-io. If not, see <https://www.gnu.org/licenses/>.
 */
import {
    NFeWizardProps,
    EventoNFe,
    NFe,
    InutilizacaoData,
    NFEGerarDanfeProps,
    Cancelamento,
    EPEC,
    EmailParams,
} from 'src/core/types';
import { NFeWizardImpl, NFeWizardServiceImpl } from '@Interfaces';
import NFeWizardService from '@Modules/dfe/nfe/services/NFeWizard/NFeWizardService';

export default class NFeWizard implements NFeWizardImpl {
    private nfeWizardService: NFeWizardServiceImpl;

    constructor() {
        this.nfeWizardService = new NFeWizardService();
    }

    async NFCE_LoadEnvironment({ config }: { config: NFeWizardProps }) {
        await this.nfeWizardService.NFCE_LoadEnvironment({ config });
    }

    /**
     * Status Serviço
     */
    async NFCE_ConsultaStatusServico() {
        return await this.nfeWizardService.NFCE_ConsultaStatusServico();
    }
    /**
     * Consulta Protocolo
     */
    async NFCE_ConsultaProtocolo(chave: string) {
        return this.nfeWizardService.NFCE_ConsultaProtocolo(chave);
    }
    /**
     * Recepção de Eventos
     */
    async NFCE_RecepcaoEvento(evento: EventoNFe) {
        return await this.nfeWizardService.NFCE_RecepcaoEvento(evento);
    }
    async NFCE_Cancelamento(evento: Cancelamento) {
        return await this.nfeWizardService.NFCE_Cancelamento(evento);
    }

    /**
     * Autorização
     */
    async NFCE_Autorizacao(data: NFe) {
        return await this.nfeWizardService.NFCE_Autorizacao(data);
    }

    /**
     * Inutilização
     */
    async NFCE_Inutilizacao(data: InutilizacaoData) {
        return await this.nfeWizardService.NFCE_Inutilizacao(data);
    }


    /**
     * DANFE
     */
    async NFCE_GerarDanfe(data: NFEGerarDanfeProps) {
        return await this.nfeWizardService.NFCE_GerarDanfe(data);
    }

    /**
     * Método para envio de e-mail
     * @param {EmailParams} mailParams - Mensagem de texto (aceita html)
     */
    NFCE_EnviaEmail(mailParams: EmailParams) {
        return this.nfeWizardService.NFCE_EnviaEmail(mailParams);
    }
}