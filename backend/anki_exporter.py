import genanki
import os

model_id = 1607392319
deck_id = 2059400110

anki_model = genanki.Model(
    model_id,
    'DeutschMe Model',
    fields=[
        {'name': 'German'},
        {'name': 'Portuguese'},
        {'name': 'Context'},
        {'name': 'Level'},
    ],
    templates=[
        {
            'name': 'Card 1',
            'qfmt': '<h3>{{German}}</h3><p><em>{{Context}}</em></p>',
            'afmt': '{{FrontSide}}<hr id="answer"><h3>{{Portuguese}}</h3><p>Level: {{Level}}</p>',
        },
    ])

def export_deck(vocab_list, filepath="deutschme_deck.apkg"):
    deck = genanki.Deck(deck_id, 'DeutschMe Vocabulary')

    for v in vocab_list:
        note = genanki.Note(
            model=anki_model,
            fields=[v.get('term', ''), v.get('translation', ''), v.get('context_sentence', ''), v.get('level', '')]
        )
        deck.add_note(note)

    genanki.Package(deck).write_to_file(filepath)
    return filepath
