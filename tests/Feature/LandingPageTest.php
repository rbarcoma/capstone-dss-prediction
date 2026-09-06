<?php

use Illuminate\Mail\Transport\ArrayTransport;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

test('the public landing page renders the standalone welcome experience', function () {
    $response = $this->get(route('home'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('auth.user'));
});

test('contact inquiries require the redesigned form fields', function () {
    $response = $this
        ->from(route('home'))
        ->post(route('contact.send'), [
            'name' => '',
            'email' => 'not-an-email',
            'subject' => '',
            'message' => 'short',
            'website' => '',
        ]);

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
});

test('valid contact inquiries are delivered with the supplied subject', function () {
    $mailer = Mail::mailer();
    $transport = $mailer->getSymfonyTransport();

    expect($transport)->toBeInstanceOf(ArrayTransport::class);

    /** @var ArrayTransport $transport */
    $transport->flush();

    $response = $this
        ->from(route('home'))
        ->post(route('contact.send'), [
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'subject' => 'Capstone methodology review',
            'message' => 'I would like to arrange a review of the research methodology.',
            'website' => '',
        ]);

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHas('success', 'Message sent successfully.');

    expect($transport->messages())->toHaveCount(1);

    $message = $transport->messages()->first()->getOriginalMessage();

    expect($message->getSubject())
        ->toBe('DSS Energy inquiry: Capstone methodology review')
        ->and($message->getTo()[0]->getAddress())
        ->toBe('dsspredictionqc@gmail.com')
        ->and($message->getReplyTo()[0]->getAddress())
        ->toBe('juan@example.com');
});

test('the contact honeypot quietly discards automated submissions', function () {
    $mailer = Mail::mailer();
    $transport = $mailer->getSymfonyTransport();

    expect($transport)->toBeInstanceOf(ArrayTransport::class);

    /** @var ArrayTransport $transport */
    $transport->flush();

    $response = $this
        ->from(route('home'))
        ->post(route('contact.send'), [
            'name' => 'Automated Sender',
            'email' => 'bot@example.com',
            'subject' => 'Automated inquiry',
            'message' => 'This automated message should not be delivered.',
            'website' => 'https://spam.example.com',
        ]);

    $response->assertSessionHas('success', 'Message sent successfully.');
    expect($transport->messages())->toHaveCount(0);
});

test('contact delivery failures return a safe error and preserve input', function () {
    Log::spy();
    Mail::shouldReceive('raw')->once()->andThrow(new RuntimeException('Transport unavailable'));

    $response = $this
        ->from(route('home'))
        ->post(route('contact.send'), [
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'subject' => 'System demonstration',
            'message' => 'I would like to arrange a demonstration of the platform.',
            'website' => '',
        ]);

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHas('error')
        ->assertSessionHasInput('subject', 'System demonstration');

    Log::shouldHaveReceived('warning')->once();
});
