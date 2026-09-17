"""Popula o banco com os dados iniciais do site (extraídos de siteData.js)."""

from app.database import SessionLocal
from app.models import Noticia, Medalista, Olimpiada, GaleriaAlbum


# ─────────────────────────────────────────────────────────
# DADOS (extraídos de src/lib/siteData.js)
# ─────────────────────────────────────────────────────────

NOTICIAS = [
    {
        "title": "Estudantes do IFPI Campus Pedro II conquistam 18 medalhas na OBMEP 2024",
        "date": "12 MAI 2025",
        "category": "Premiações",
        "summary": "Resultado histórico para o campus com 6 ouros, 7 pratas, 5 bronzes e menções honrosas.",
        "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f3?w=600&h=400&fit=crop",
        "views": 1240,
        "read_time": "4 min",
    },
    {
        "title": "Inscrições abertas para a OBI 2025",
        "date": "05 MAI 2025",
        "category": "Olimpíadas",
        "summary": "Participe da Olimpíada Brasileira de Informática e desafie seus limites! Inscrições até 30 de junho.",
        "image": "https://images.unsplash.com/photo-1526374965328-7f61d4c18cb0?w=600&h=400&fit=crop",
        "views": 890,
        "read_time": "3 min",
    },
    {
        "title": "OlimpIFP2 realiza cerimônia de entrega de medalhas",
        "date": "28 ABR 2025",
        "category": "Projeto",
        "summary": "Estudantes foram homenageados em evento que celebrou as conquistas do ano.",
        "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop",
        "views": 1560,
        "read_time": "5 min",
    },
    {
        "title": "Aulão preparatório para a OBMEP reúne mais de 100 estudantes",
        "date": "15 ABR 2025",
        "category": "Eventos",
        "summary": "Encontro marcou o início da temporada de olimpíadas do conhecimento.",
        "image": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop",
        "views": 720,
        "read_time": "3 min",
    },
    {
        "title": "Campus Pedro II firma parceria com projeto de extensão",
        "date": "02 ABR 2025",
        "category": "Institucional",
        "summary": "Iniciativa amplia o apoio aos estudantes participantes das olimpíadas.",
        "image": "https://images.unsplash.com/photo-1517245386807-bb43f82fee33?w=600&h=400&fit=crop",
        "views": 540,
        "read_time": "2 min",
    },
    {
        "title": "Estudante do campus é destaque nacional na OBM",
        "date": "20 MAR 2025",
        "category": "Premiações",
        "summary": "Aluno do 3º ano conquista medalha de ouro em competição nacional.",
        "image": "https://images.unsplash.com/photo-1606761568499-6d2451b23ee9?w=600&h=400&fit=crop",
        "views": 2100,
        "read_time": "4 min",
    },
]


MEDALHISTAS = [
    {
        "name": "Ana Beatriz Silva",
        "medal": "Ouro",
        "olympiad": "OBMEP 2024",
        "course": "3º ano - Informática",
        "quote": "Cada problema resolvido é um passo a mais rumo à conquista.",
        "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
        "name": "Lucas Martins Oliveira",
        "medal": "Prata",
        "olympiad": "OBI 2024",
        "course": "2º ano - Informática",
        "quote": "A lógica me ensinou que todo desafio tem um caminho.",
        "photo": "https://images.unsplash.com/photo-1500648766835-8583f6785748?w=400&h=400&fit=crop",
    },
    {
        "name": "Júlia Fernandes Costa",
        "medal": "Bronze",
        "olympiad": "ONC 2024",
        "course": "3º ano - Agropecuária",
        "quote": "A ciência está em tudo, basta saber onde olhar.",
        "photo": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
        "name": "Pedro Henrique Alves",
        "medal": "Ouro",
        "olympiad": "OBM 2024",
        "course": "1º ano - Informática",
        "quote": "A matemática é a linguagem do universo.",
        "photo": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
    },
    {
        "name": "Mariana Rocha Lima",
        "medal": "Prata",
        "olympiad": "OBQ 2024",
        "course": "2º ano - Agropecuária",
        "quote": "Cada reação química me lembra que tudo se transforma.",
        "photo": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
    },
    {
        "name": "Gabriel Souza Mendes",
        "medal": "Ouro",
        "olympiad": "OBNE 2024",
        "course": "3º ano - Informática",
        "quote": "Empreender é transformar ideias em soluções reais.",
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
]


OLIMPIADAS = [
    {"name": "OBMEP", "area": "Matemática", "level": "Do 6º ano ao 3º EM", "desc": "Olimpíada Brasileira de Matemática das Escolas Públicas.", "medal": "Ouro"},
    {"name": "OBI", "area": "Tecnologia", "level": "Ensino Médio", "desc": "Olimpíada Brasileira de Informática.", "medal": "Prata"},
    {"name": "OBM", "area": "Matemática", "level": "Ensino Médio", "desc": "Olimpíada Brasileira de Matemática.", "medal": "Ouro"},
    {"name": "ONC", "area": "Ciências da Natureza", "level": "Do 8º ano ao 3º EM", "desc": "Olimpíada Nacional de Ciências.", "medal": "Bronze"},
    {"name": "OBQ", "area": "Ciências da Natureza", "level": "Ensino Médio", "desc": "Olimpíada Brasileira de Química.", "medal": "Prata"},
    {"name": "OBF", "area": "Ciências da Natureza", "level": "Ensino Médio", "desc": "Olimpíada Brasileira de Física.", "medal": "Ouro"},
    {"name": "OBB", "area": "Ciências da Natureza", "level": "Ensino Médio", "desc": "Olimpíada Brasileira de Biologia.", "medal": "Bronze"},
    {"name": "OBNE", "area": "Empreendedorismo", "level": "Ensino Médio", "desc": "Olimpíada Brasileira de Negócios e Empreendedorismo.", "medal": "Ouro"},
    {"name": "OPL", "area": "Linguagens", "level": "Do 6º ao 9º ano", "desc": "Olimpíada de Língua Portuguesa.", "medal": "Prata"},
    {"name": "OBH", "area": "Humanas", "level": "Ensino Médio", "desc": "Olimpíada Brasileira de História.", "medal": "Honra"},
    {"name": "OBA", "area": "Ciências da Natureza", "level": "Do 6º ano ao 3º EM", "desc": "Olimpíada Brasileira de Astronomia e Astronáutica.", "medal": "Bronze"},
    {"name": "OBI Jr", "area": "Tecnologia", "level": "Do 6º ao 9º ano", "desc": "Modalidade de iniciantes da OBI.", "medal": "Prata"},
]


GALERIA = [
    {"title": "Aplicação da OBMEP 2026", "date": "07 JUN 2026", "category": "Aplicações", "photos": 122, "image": "https://images.unsplash.com/photo-1503676267111-225ef20ad4f0?w=500&h=350&fit=crop"},
    {"title": "Cerimônia de Premiação 2025", "date": "22 MAI 2026", "category": "Premiações", "photos": 89, "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=350&fit=crop"},
    {"title": "Aulão de Preparação OBMEP", "date": "10 MAI 2026", "category": "Aulas e Oficinas", "photos": 64, "image": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=350&fit=crop"},
    {"title": "Palestra: Carreiras em Tecnologia", "date": "28 ABR 2026", "category": "Palestras", "photos": 47, "image": "https://images.unsplash.com/photo-1475721027785-f74eccf877d2?w=500&h=350&fit=crop"},
    {"title": "Visita Técnica ao Parque Nacional", "date": "15 ABR 2026", "category": "Visitas e Passeios", "photos": 73, "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&h=350&fit=crop"},
    {"title": "Reunião da Equipe Olímpica", "date": "03 ABR 2026", "category": "Equipe e Reuniões", "photos": 38, "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=350&fit=crop"},
    {"title": "Bastidores da Aplicação OBI", "date": "18 MAR 2026", "category": "Bastidores", "photos": 52, "image": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&h=350&fit=crop"},
    {"title": "Oficina de Lógica de Programação", "date": "05 MAR 2026", "category": "Aulas e Oficinas", "photos": 41, "image": "https://images.unsplash.com/photo-1531482615723-e294e3a8c5c9?w=500&h=350&fit=crop"},
]


# ─────────────────────────────────────────────────────────
# SEED
# ─────────────────────────────────────────────────────────

def seed():
    db = SessionLocal()
    try:
        # Notícias
        if db.query(Noticia).count() == 0:
            for item in NOTICIAS:
                db.add(Noticia(**item))
            print(f"✅ {len(NOTICIAS)} notícias inseridas")
        else:
            print(f"⚠️  Notícias já existem ({db.query(Noticia).count()}), pulando...")

        # Medalhistas
        if db.query(Medalista).count() == 0:
            for item in MEDALHISTAS:
                db.add(Medalista(**item))
            print(f"✅ {len(MEDALHISTAS)} medalhistas inseridos")
        else:
            print(f"⚠️  Medalhistas já existem, pulando...")

        # Olimpíadas
        if db.query(Olimpiada).count() == 0:
            for item in OLIMPIADAS:
                db.add(Olimpiada(**item))
            print(f"✅ {len(OLIMPIADAS)} olimpíadas inseridas")
        else:
            print(f"⚠️  Olimpíadas já existem, pulando...")

        # Galeria
        if db.query(GaleriaAlbum).count() == 0:
            for item in GALERIA:
                db.add(GaleriaAlbum(**item))
            print(f"✅ {len(GALERIA)} álbuns inseridos")
        else:
            print(f"⚠️  Álbuns já existem, pulando...")

        db.commit()
        print("\n🎉 Seed concluído com sucesso!")
    except Exception as e:
        db.rollback()
        print(f"❌ Erro: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()