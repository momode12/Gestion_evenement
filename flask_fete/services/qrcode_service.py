from io import BytesIO
import qrcode
import qrcode.image.styledpil
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image


def generer_qrcode_avec_photo(qr_text, photo_bytes, photo_size=(100, 100)):
    """
    Génère un QR code stylisé (coins arrondis, noir/blanc) avec la photo
    du client collée au centre. Logique inchangée par rapport à l'original.
    Retourne les bytes PNG du QR code final.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_text)
    qr.make(fit=True)

    qr_image = qr.make_image(
        image_factory=qrcode.image.styledpil.StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=SolidFillColorMask(back_color=(255, 255, 255), front_color=(0, 0, 0)),
        embeded_image_path=None
    )

    client_photo = Image.open(BytesIO(photo_bytes))
    client_photo = client_photo.resize(photo_size, Image.LANCZOS)

    qr_width, qr_height = qr_image.size
    photo_width, photo_height = photo_size
    position = ((qr_width - photo_width) // 2, (qr_height - photo_height) // 2)

    qr_image.paste(client_photo, position)

    buffer = BytesIO()
    qr_image.save(buffer, format='PNG')
    return buffer.getvalue()


def construire_texte_qr(cin, nom, prenom, email, adresse, telephone, paf):
    return (
        f"CIN: {cin}\n"
        f"Nom: {nom}\n"
        f"Prénom: {prenom}\n"
        f"Email: {email}\n"
        f"Adresse: {adresse}\n"
        f"Téléphone: {telephone}\n"
        f"PAF: {paf}"
    )