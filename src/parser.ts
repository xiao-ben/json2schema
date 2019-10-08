import { visit } from 'jsonc-parser'
import { Instruction, Scope, ScopeType, ValueDescriptor } from './structures'

class CommentedJsonParser {
  source: string = ''

  prevProperty: ValueDescriptor | null = null
  currentProperty: ValueDescriptor | null = null

  scopeStack: Array<Scope> = []

  private getCurrentProperty(): ValueDescriptor {
    if (this.currentProperty == null) {
      this.currentProperty = {
        instructions: []
      }
    }

    return this.currentProperty
  }

  private completeProperty() {
    this.prevProperty = this.currentProperty
    this.currentProperty = null
  }

  private getCurrentScope(): Scope | null {
    return this.scopeStack[this.scopeStack.length - 1]
  }

  private startScope(type: ScopeType) {
    const scope = new Scope(type)
    this.scopeStack.push(scope)
    return scope
  }

  private endScope() {
    if (this.scopeStack.length > 1) {
      this.scopeStack.pop()
    }
  }

  private parseComment(str: string) {
    const instructions: Array<Instruction> = []
    const comment = str.replace(
      /@(\w+)(\(([\w,"'\s]+)\))?/g,
      (_all, name, _, params) => {
        instructions.push({
          name: name,
          params: params ? params.split(',').map(item => item.trim()) : []
        })

        return ''
      }
    )

    return {
      comment,
      instructions
    }
  }

  parse(jsonString: string) {
    this.source = jsonString
    visit(this.source, {
      onObjectProperty: property => {
        const p = this.getCurrentProperty()
        const scope = this.getCurrentScope()
        if (scope) {
          scope.set(property, p)
        }
      },

      onLiteralValue: value => {
        const scope = this.getCurrentScope()
        const p = this.getCurrentProperty()

        p.example = value
        p.type = value === null ? 'null' : typeof value

        if (scope && scope.type === ScopeType.Array) {
          scope.add(p)
        }
        this.completeProperty()
      },

      onComment: (offset, length, startLine, startCharacter) => {
        let comment = this.source.substr(offset, length).slice(2)

        const lineOffset = offset - startCharacter
        const aheadOfComment = this.source
          .substr(lineOffset, startCharacter)
          .trim()

        let property = null
        if (aheadOfComment.length > 0 && this.prevProperty) {
          property = this.prevProperty
        } else {
          property = this.getCurrentProperty()
          if (property.comment) {
            comment = (comment + property.comment).replace(/\s+/g, ' ')
          }
        }

        const parsedComment = this.parseComment(comment)
        property.comment = parsedComment.comment
        property.instructions = parsedComment.instructions
      },

      onArrayBegin: () => {
        const type = ScopeType.Array
        const scope = this.startScope(type)

        if (this.currentProperty) {
          const p = this.getCurrentProperty()
          p.type = type
          p.value = scope
          this.completeProperty()
        }
      },
      onArrayEnd: () => {
        this.endScope()
      },

      onObjectBegin: () => {
        const currentScope = this.getCurrentScope()
        const newScope = this.startScope(ScopeType.Object)

        if (currentScope && currentScope.type === ScopeType.Array) {
          currentScope.add(newScope)
        } else if (this.currentProperty) {
          const p = this.getCurrentProperty()
          p.type = ScopeType.Object
          p.value = newScope
          this.completeProperty()
        }
      },
      onObjectEnd: () => {
        this.endScope()
      }
    })

    return this.scopeStack[0]
  }
}

export function parse(jsonString: string) {
  return new CommentedJsonParser().parse(jsonString)
}
