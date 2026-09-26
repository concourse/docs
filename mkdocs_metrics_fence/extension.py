import re
from markdown.extensions import Extension
from markdown.preprocessors import Preprocessor

METRICS_ROOT_URL = "https://prometheus.io/docs/concepts/metric_types/"

FENCE_PATTERN = re.compile(r"```metrics\n(.*?)\n```", re.DOTALL)
METRIC_LINE_PATTERN = re.compile(r'# HELP (\w+) (.*)\n# TYPE \1 (\w+)')


class MetricsFencePreprocessor(Preprocessor):
    def run(self, lines):
        text = "\n".join(lines)

        def replace_with_admonition(match):
            content = match.group(1)
            metrics = METRIC_LINE_PATTERN.findall(content)

            blocks = []
            for name, help_text, metric_type in metrics:
                blocks.append(
                    f'???+ info "**`{name}`**: [`{metric_type}`]({METRICS_ROOT_URL}#{metric_type})"\n'
                    f'    {help_text.strip()}\n'
                )
            return "\n".join(blocks)

        text = FENCE_PATTERN.sub(replace_with_admonition, text)
        return text.split("\n")


class MetricsFenceExtension(Extension):
    def extendMarkdown(self, md):
        # priority just needs to run before block-level parsing, which it
        # always does as a preprocessor — 30 keeps it ahead of the rest
        md.preprocessors.register(MetricsFencePreprocessor(md), "metrics_fence", 30)


def makeExtension(**kwargs):
    return MetricsFenceExtension(**kwargs)