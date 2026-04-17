package com.movie.amqp;


import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class RabbitMQConfig {

    private static final Logger log = LoggerFactory.getLogger(RabbitMQConfig.class);

    @Autowired
    private ConnectionFactory connectionFactory;

    @Autowired
    private Environment environment;

    @PostConstruct
    public void logRabbitMQConfiguration() {
        String uri = environment.getProperty("spring.rabbitmq.uri");
        String addresses = environment.getProperty("spring.rabbitmq.addresses");
        String host = environment.getProperty("spring.rabbitmq.host");
        String port = environment.getProperty("spring.rabbitmq.port");
        String username = environment.getProperty("spring.rabbitmq.username");
        String virtualHost = environment.getProperty("spring.rabbitmq.virtual-host");

        log.info("Active RabbitMQ configuration:");
        log.info("  spring.rabbitmq.uri={}", uri);
        log.info("  spring.rabbitmq.addresses={}", addresses);
        log.info("  spring.rabbitmq.host={}", host);
        log.info("  spring.rabbitmq.port={}", port);
        log.info("  spring.rabbitmq.username={}", username);
        log.info("  spring.rabbitmq.virtual-host={}", virtualHost);
        log.info("  connectionFactory={}", connectionFactory.getClass().getName());
    }

    @Bean
    public AmqpTemplate amqpTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jacksonConverter());
        return rabbitTemplate;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory simpleRabbitListenerContainerFactory() {
        SimpleRabbitListenerContainerFactory factory =
                new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jacksonConverter());
        return factory;
    }

    @Bean
    public MessageConverter jacksonConverter() {
        MessageConverter jackson2JsonMessageConverter =
                new Jackson2JsonMessageConverter();
        return jackson2JsonMessageConverter;
    }

}