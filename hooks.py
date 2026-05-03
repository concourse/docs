import re

def on_page_markdown(markdown, **kwargs):
    # This pattern looks for blocks fenced with ```metrics ... ```
    # It captures the raw content inside the code block
    pattern = re.compile(
        r"```metrics\n(.*?)\n```",
        re.DOTALL
    )

    metrics_root_url = "https://prometheus.io/docs/concepts/metric_types/"

    def replace_with_admonition(match):
        content = match.group(1)
        # Parse the HELP and TYPE lines
        metric_pattern = r'# HELP (\w+) (.*)\n# TYPE \1 (\w+)'
        metrics = re.findall(metric_pattern, content)

        admonitions = []
        for name, help_text, metric_type in metrics:
            block = (
                f'???+ info "**`{name}`**: [`{metric_type}`]({metrics_root_url}#{metric_type})"\n'
                f'    {help_text.strip()}\n'
            )
            admonitions.append(block)

        return "\n".join(admonitions)

    return pattern.sub(replace_with_admonition, markdown)