import {
    Cancelamento,
    EmailParams,
    EPEC,
    EventoNFe,
    GenericObject,
    InutilizacaoData,
    LayoutNFe,
    NFe,
    NFEGerarDanfeProps,
    NFeWizardProps,
    ProtNFe
} from '@Types';

export interface NFeWizardServiceImpl {
    NFCE_LoadEnvironment({ config }: {
        config: NFeWizardProps;
    }): Promise<void>;
    NFCE_ConsultaStatusServico(): Promise<any>;
    NFCE_ConsultaProtocolo(chave: string): Promise<any>;
    NFCE_RecepcaoEvento(evento: EventoNFe): Promise<GenericObject[]>;
    NFCE_Cancelamento(evento: Cancelamento): Promise<GenericObject[]>;
    NFCE_Autorizacao(data: NFe): Promise<{
        NFe: LayoutNFe;
        protNFe: ProtNFe;
    }[]>;
    NFCE_Inutilizacao(data: InutilizacaoData): Promise<any>;
    NFCE_GerarDanfe(data: NFEGerarDanfeProps): Promise<{
        message: string;
        success: boolean;
    }>;
    NFCE_EnviaEmail(mailParams: EmailParams): void;
}