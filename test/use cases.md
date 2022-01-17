Beware! we shape our tools. Then, our tools shape us.

## A conversation

To know all the conversations I had with someone, and the context. Can be seen in a time-line

```markdown
## 09-12-2021

I think we should launch now, but according to [[@John]] we should wait. 
```

```turtle

<conversation> a :Conversation;
               :people (<john> <me>) ;
               :date '09-12-2021' ;
               :text 'I think we should launch now, but according to [[@John]] we should wait.' .
```

## Simple sentence

Backstage is a project founded by [[@Thomas Prevost]]. I've always had ...

```turtle
:Backstage a :Project ;
    :foundedBy <prevost> .
```

## Time logging

I've worked on [[Task 3 - Explorer]] for 3 hours (09-12-2021)

```turtle
<task3> :log [ :date '09-12-2021' ; :hours 3 ] .
```

## Language variants

```markdown
# Alejandra Pizarnik

Alejandra Pizarnik es una escritora, contemporánea a Cortázar

> Creo que la melancolía es, en suma, un problema musical: una disonancia, un ritmo trastornado.
Alejandra Pizarnik

> Tanto miente el que ríe demasiado, como el que sólo llora
[[@Alejandra Pizarnik]]

> La muerte es una palabra. Fragmento de El sueño de la muerte o el lugar de los cuerpos poéticos, [[@Alejandra Pizarnik]]
```

```turtle
<pizarnik> a :Writer ;
    :hasQuote "Tanto miente el que ríe demasiado, como el que sólo llora."@es ;
:hasQuote "La muerte es una palabra. Fragmento de El sueño de la muerte o el lugar de los cuerpos poéticos"@es .
```



