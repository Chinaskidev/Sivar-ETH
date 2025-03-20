import requests
import json

def llamar_api(url, payload=None):
    """
    Realiza una llamada a una API y devuelve la respuesta.

    Ejemplo de payload:
    {
        "model": "gemma3:12b",
        "prompt": "cuanto es 2+2",
        "stream": False
    }

    Args:
        url (str): La URL de la API.
        payload (dict, opcional): Datos para la solicitud en formato JSON.

    Returns:
        dict: La respuesta de la API en formato JSON, si es válida.
    """
    try:
        # Enviamos la solicitud usando el cuerpo JSON.
        respuesta = requests.post(url, json=payload)
        respuesta.raise_for_status()  # Lanza una excepción si el código de estado no es 200
        return respuesta.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al realizar la solicitud: {e}")
        return None

# Ejemplo de uso
if __name__ == "__main__":
    url = "https://afb7-24-228-25-127.ngrok-free.app/api/generate"
    payload = {
        "model": "gemma3:12b",
        "prompt": "cuantame un cuento de 10 lineas",
        "stream": False
    }
    
    respuesta = llamar_api(url, payload)
    
    if respuesta:
        print("Respuesta de la API:", respuesta)
    else:
        print("No se pudo obtener una respuesta válida de la API.")
