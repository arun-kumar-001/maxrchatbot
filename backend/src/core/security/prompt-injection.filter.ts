import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptInjectionFilter {
  private readonly patterns = [
    /ignore\s+(all\s+)?(previous|prior)\s+(instructions|directions)/i,
    /forget\s+(all\s+)?(previous|prior)\s+(instructions|directions)/i,
    /you\s+are\s+(now|a)\s+(free|unbounded|without)/i,
    /system\s+prompt/i,
    /\[system\]/i,
    /<\|im_start\|>/i,
    /role\s*:\s*system/i,
  ];

  hasInjection(input: string): boolean {
    return this.patterns.some((pattern) => pattern.test(input));
  }

  sanitize(input: string): string {
    if (this.hasInjection(input)) {
      return input.replace(
        /(ignore|forget|you\s+are|system\s+prompt|\[system\]|<\|im_start\|>)/gi,
        '[filtered]',
      );
    }
    return input;
  }
}