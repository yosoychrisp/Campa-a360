"""
Servicio de integración con la API oficial de WhatsApp Business (Meta Cloud API).

Requiere, en el archivo .env del backend:
  - WHATSAPP_API_TOKEN: token de acceso permanente de tu app de Meta for Developers
  - WHATSAPP_PHONE_NUMBER_ID: ID del número de teléfono verificado en WhatsApp Business
  - WHATSAPP_API_VERSION: versión de la Graph API (ej: v20.0)

Documentación oficial: https://developers.facebook.com/docs/whatsapp/cloud-api
"""
import httpx
from typing import Optional
from app.core.config import settings


class WhatsAppService:
    def __init__(self):
        self.token = settings.WHATSAPP_API_TOKEN
        self.phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID
        self.base_url = f"https://graph.facebook.com/{settings.WHATSAPP_API_VERSION}/{self.phone_number_id}"

    def _headers(self):
        return {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}

    def is_configured(self) -> bool:
        return bool(self.token and self.phone_number_id)

    def send_text(self, to_phone: str, body: str) -> dict:
        payload = {
            "messaging_product": "whatsapp",
            "to": to_phone,
            "type": "text",
            "text": {"body": body},
        }
        return self._post_messages(payload)

    def send_media(self, to_phone: str, media_url: str, media_type: str, caption: Optional[str] = None) -> dict:
        """media_type: image | document | video | audio"""
        payload = {
            "messaging_product": "whatsapp",
            "to": to_phone,
            "type": media_type,
            media_type: {"link": media_url, **({"caption": caption} if caption else {})},
        }
        return self._post_messages(payload)

    def send_template(self, to_phone: str, template_name: str, language_code: str = "es") -> dict:
        payload = {
            "messaging_product": "whatsapp",
            "to": to_phone,
            "type": "template",
            "template": {"name": template_name, "language": {"code": language_code}},
        }
        return self._post_messages(payload)

    def _post_messages(self, payload: dict) -> dict:
        if not self.is_configured():
            # En entornos de desarrollo/demo sin credenciales de Meta configuradas
            return {"simulated": True, "detail": "WHATSAPP_API_TOKEN / WHATSAPP_PHONE_NUMBER_ID no configurados"}
        with httpx.Client(timeout=15) as client:
            resp = client.post(f"{self.base_url}/messages", headers=self._headers(), json=payload)
            resp.raise_for_status()
            return resp.json()


whatsapp_service = WhatsAppService()
